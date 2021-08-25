#!/bin/bash

export REGISTRY_NAME="localhost:5000"
export FRONTEND_LB_PREFIX="http://localhost:3000"
export FRONTEND_URL="${FRONTEND_LB_PREFIX}"
export BACKEND_LB_PREFIX="http://localhost:8000"
export BACKEND_URL="${BACKEND_LB_PREFIX}/api"
export MONGO_PASSWORD="simplepassword"
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
    log_green "Create a Kind cluster with local registry"
    curl -s https://raw.githubusercontent.com/tilt-dev/kind-local/master/kind-with-registry.sh | bash

    log_blue "Waiting until Kind node is ready..."
    kubectl wait --for=condition=Ready nodes --all --all-namespaces

    log_blue "Kind is ready."
}

generate-manifests() {
    log_green "Generating Kubernetes manifests from templates..."
    log_blue "Generated manifests will be under ${SCRIPT_DIR}/k8s-manifests/generated-local"

    mkdir -p ${SCRIPT_DIR}/local/generated

    log_blue "Generating knowzone secret..."
    envsubst < ${SCRIPT_DIR}/k8s-manifests/knowzone-secret-template.yaml > ${SCRIPT_DIR}/local/generated/knowzone-secret.yaml

    log_blue "Generating backend manifest..." 
    envsubst < ${SCRIPT_DIR}/k8s-manifests/backend-template.yaml > ${SCRIPT_DIR}/local/generated/backend.yaml

    log_blue "Generating frontend manifest..." 
    envsubst < ${SCRIPT_DIR}/k8s-manifests/frontend-template.yaml > ${SCRIPT_DIR}/local/generated/frontend.yaml
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
    kubectl apply -f ${SCRIPT_DIR}/k8s-manifests/mongo-replicaset.yaml
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
    kind delete clusters kind

    log_blue "Deleting local registry on port 5000..."
    docker stop kind-registry && docker rm kind-registry
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
