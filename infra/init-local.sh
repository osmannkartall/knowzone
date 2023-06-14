#!/bin/bash

# Environment variables required for setting up the local cluster.
# Please do not modify below values.

export REGISTRY_NAME="localhost:5000"
export FRONTEND_URL="http://localhost:3005"
export BACKEND_URL="http://localhost:8000"
export MONGO_PASSWORD="simplepassword"
export SESSION_SECRET="knowzone-auth-secret"
export VERSION="dev"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Log colors
log_green() { printf "\x1B[32m>> %s\x1B[39m\n" "$1"; }
log_red() { printf "\x1B[31m>> %s\x1B[39m\n" "$1"; }
log_blue() { printf "\x1B[94m>> %s\x1B[39m\n" "$1"; }

if [[ "${#}" -gt 1 ]]
then
    log_red "Invalid option. Type '`basename ${0}` help' for available commands."
    exit 1
fi

# Check if pre-requisites are on the path
declare -a PREREQUISITES=("git" "minikube" "docker" "tilt" "kubectl")
for i in "${PREREQUISITES[@]}"
do
    if ! [[ -x "$(command -v ${i})" ]]
    then
        echo "Error: ${i} command could not be found. Is it on the path?"
        exit 1
    fi
done

interactive() {
    create-cluster
    log_green "Continue generating manifests? [y/N]"
    read -p "" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]
    then
        generate-manifests
        log_green "Continue deploying secrets and MongoDB? [y/N]"
        read -p "" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]
        then
            deploy-secret
            deploy-mongo
            log_blue "You can reach MongoDB on port 27018 with 'kubectl port-forward mongodb-0'"
            log_blue "Use below connection string to interact with MongoDB instance after port forwarding"
            log_blue "mongodb://kz-user:simplepassword@localhost:27018/admin?ssl=false"
            log_green "Run development environment with Tilt? [y/N]"
            read -p "" -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]
            then
                run-tilt
            fi
            log_blue "Exiting..."
            exit 0
        fi
        echo "Exiting..."
        exit 0
    fi
    log_blue "Exiting..."
    exit 0
}

create-cluster() {
    log_green "Creating a minikube cluster"
    minikube start --cpus 3 --memory 5120
    minikube addons enable metrics-server

    log_blue "Waiting until minikube node is ready..."
    kubectl wait --for=condition=Ready nodes --all --all-namespaces

    log_blue "Changing local registry..."
    eval $(minikube docker-env)

    log_blue "minikube is ready."
}

generate-manifests() {
    log_green "Generating Kubernetes manifests from templates..."
    log_blue "Generated manifests will be under ${SCRIPT_DIR}/local/generated"

    mkdir -p ${SCRIPT_DIR}/local/generated

    log_blue "Generating knowzone secret..."
    envsubst < ${SCRIPT_DIR}/k8s-manifests/test/knowzone-secret-template.yaml > ${SCRIPT_DIR}/local/generated/knowzone-secret.yaml

    log_blue "Generating backend manifest..." 
    envsubst < ${SCRIPT_DIR}/k8s-manifests/test/backend-template.yaml > ${SCRIPT_DIR}/local/generated/backend.yaml

    log_blue "Generating frontend manifest..." 
    envsubst < ${SCRIPT_DIR}/k8s-manifests/test/frontend-template.yaml > ${SCRIPT_DIR}/local/generated/frontend.yaml
}

deploy-secret() {
    log_green "Deploying secret to Kubernetes..."

    kubectl apply -f ${SCRIPT_DIR}/local/generated/knowzone-secret.yaml
}

deploy-mongo() {
    log_green "Deploy MongoDB to Kubernetes"

    log_blue "Cloning official MongoDB Kubernetes Operator git repository..."
    git -C ${SCRIPT_DIR} clone https://github.com/mongodb/mongodb-kubernetes-operator.git

    log_blue "Deploying Custom Resource Definitions to Kubernetes..."
    kubectl apply -f ${SCRIPT_DIR}/mongodb-kubernetes-operator/config/crd/bases/mongodbcommunity.mongodb.com_mongodbcommunity.yaml
    kubectl -n default wait --for condition=established crd mongodbcommunity.mongodbcommunity.mongodb.com

    log_blue "Deploying RBAC to Kubernetes..."
    kubectl apply -k ${SCRIPT_DIR}/mongodb-kubernetes-operator/config/rbac/ --namespace default

    log_blue "Creating MongoDB Operator..."
    kubectl create -f ${SCRIPT_DIR}/mongodb-kubernetes-operator/config/manager/manager.yaml --namespace default
    kubectl rollout status deployment mongodb-kubernetes-operator

    log_blue "Deploying MongoDB replicaset, this may take a few minutes..."
    # Apply user generated manifests
    kubectl apply -f ${SCRIPT_DIR}/k8s-manifests/test/mongo-replicaset.yaml
    sleep 10
    kubectl rollout status statefulset mongodb

    # For more information, check below link
    # https://github.com/mongodb/mongodb-kubernetes-operator/blob/master/docs/deploy-configure.md
}

run-tilt() {
    log_green "Run Tilt development environment"
    tilt up
}

cleanup() {
    if [[ -d "${SCRIPT_DIR}/mongodb-kubernetes-operator" ]]
    then
        log_blue "Deleting MongoDB repository..."
        rm -rf ${SCRIPT_DIR}/mongodb-kubernetes-operator
    fi

    if [[ -d "${SCRIPT_DIR}/local/generated" ]]
    then
        log_blue "Deleting generated manifests..."
        rm -rf ${SCRIPT_DIR}/local/generated
    fi

    log_blue "Deleting cluster..."
    minikube delete
}

case "${1}" in
    run)
        interactive
        exit 0
        ;;
    clean)
        cleanup
        exit 0
        ;;
    help | -h | --help)
        log_green "Usage: `basename ${0}` [run|clean|help]"
        log_green "Script to build and deploy Knowzone project on local machine."
        exit 0
        ;;
    *)
        log_red "Invalid option. Type '`basename ${0}` help' for available commands."
        exit 1
        ;;
esac
