#!/bin/bash

### EDIT BELOW ENVIRONMENT VARIABLES BEFORE USING THIS SCRIPT

export REGISTRY_NAME="FULL-AZURE-REGISTRY-NAME"
export FRONTEND_LB_PREFIX="FRONTEND-PREFIX-URL"
export FRONTEND_URL="http://${FRONTEND_LB_PREFIX}.<LOCATION>.cloudapp.azure.com"
export BACKEND_LB_PREFIX="YOUR-BACKEND-PREFIX-URL"
export BACKEND_URL="http://${BACKEND_LB_PREFIX}.<LOCATION>.cloudapp.azure.com"
export MONGO_PASSWORD="MONGO-PASSWORD"
export VERSION="IMAGE-VERSION"

#############################################################

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Log colors
log_green() { printf "\x1B[32m>> %s\x1B[39m\n" "$1"; }
log_red() { printf "\x1B[31m>> %s\x1B[39m\n" "$1"; }
log_blue() { printf "\x1B[94m>> %s\x1B[39m\n" "$1"; }

if [[ "${#}" -gt 2 ]]
then
    log_red "Invalid option. Type '`basename ${0}` help' for available commands."
    exit 1
fi

# Check if pre-requisites are on the path
declare -a PREREQUISITES=("git" "docker" "kubectl")
for i in "${PREREQUISITES[@]}"
do
    if ! [[ -x "$(command -v ${i})" ]]
    then
        echo "Error: ${i} command could not be found. Is it on the path?"
        exit 1
    fi
done

generate-manifests() {
    log_green "Generating Kubernetes manifests from templates..."
    log_blue "Generated manifests will be under ${SCRIPT_DIR}/k8s-manifests/generated"

    mkdir -p ${SCRIPT_DIR}/k8s-manifests/generated

    log_blue "Generating knowzone secret..."
    envsubst < ${SCRIPT_DIR}/k8s-manifests/knowzone-secret-template.yaml > ${SCRIPT_DIR}/k8s-manifests/generated/knowzone-secret.yaml

    log_blue "Generating backend manifest..." 
    envsubst < ${SCRIPT_DIR}/k8s-manifests/backend-template.yaml > ${SCRIPT_DIR}/k8s-manifests/generated/backend.yaml

    log_blue "Generating frontend manifest..." 
    envsubst < ${SCRIPT_DIR}/k8s-manifests/frontend-template.yaml > ${SCRIPT_DIR}/k8s-manifests/generated/frontend.yaml
}

build-backend() {
    log_green "Build and push frontend"

    log_blue "Building backend image..."
    docker build ${SCRIPT_DIR}/../ -f ${SCRIPT_DIR}/Dockerfile.server --tag ${REGISTRY_NAME}/knowzone-backend:${VERSION}
    
    log_blue "Pushing backend to ${REGISTRY_NAME}..."
    docker push ${REGISTRY_NAME}/knowzone-backend:${VERSION}
}

build-frontend() {
    log_green "Build and push frontend"

    log_blue "Building frontend image..."
    docker build ${SCRIPT_DIR}/../ --build-arg KNOWZONE_BE_URI=${BACKEND_URL} --build-arg KNOWZONE_FE_URI=${FRONTEND_URL} -f ${SCRIPT_DIR}/Dockerfile.web --tag ${REGISTRY_NAME}/knowzone-frontend:${VERSION}

    log_blue "Pushing frontend to ${REGISTRY_NAME}..."
    docker push ${REGISTRY_NAME}/knowzone-frontend:${VERSION}
}

deploy-secret() {
    log_green "Deploying secret to Kubernetes..."

    kubectl apply -f ${SCRIPT_DIR}/k8s-manifests/generated/knowzone-secret.yaml
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

    log_blue "Deploying MongoDB replicaset..."
    # Apply user generated manifests
    kubectl apply -f ${SCRIPT_DIR}/k8s-manifests/mongo-replicaset.yaml
    kubectl rollout status statefulset mongodb

    # For more information, check below link
    # https://github.com/mongodb/mongodb-kubernetes-operator/blob/master/docs/deploy-configure.md
}

deploy-frontend() {
    log_green "Deploy frontend to Kubernetes"

    log_blue "Deploying manifest to Kubernetes..."
    kubectl apply -f ${SCRIPT_DIR}/k8s-manifests/generated/frontend.yaml
    kubectl rollout status deployment frontend
}

deploy-backend() {
    log_green "Deploy backend to Kubernetes"

    log_blue "Deploying manifest to Kubernetes..."
    kubectl apply -f ${SCRIPT_DIR}/k8s-manifests/generated/backend.yaml
    kubectl rollout status deployment backend
}

cleanup() {
    if [[ -d "${SCRIPT_DIR}/mongodb-kubernetes-operator" ]]
    then
        log_blue "Deleting MongoDB repository..."
        rm -rf ${SCRIPT_DIR}/mongodb-kubernetes-operator
    fi

    if [[ -d "${SCRIPT_DIR}/k8s-manifests/generated" ]]
    then
        log_blue "Deleting generated manifests..."
        rm -rf ${SCRIPT_DIR}/k8s-manifests/generated
    fi
}

case "${1}" in
    generate)
        generate-manifests
        exit 0
        ;;
    build)
        shift
        case "${1}" in
            frontend)
                build-frontend
                exit 0
                ;;
            backend)
                build-backend
                exit 0
                ;;
            all)
                build-backend
                build-frontend
                exit 0
                ;;
            help | -h | --help)
                log_green "Usage: `basename ${0}` build [frontend|backend|all]"
                log_green "Builds Docker images and pushes them to the registry."
                exit 0
                ;;
            *)
                log_red "Invalid option."
                log_red "Usage: `basename ${0}` build [frontend|backend|all]"
                exit 1
                ;;
        esac
        ;;
    deploy)
        shift
        case "${1}" in
            secret)
                deploy-secret
                exit 0
                ;;
            mongo)
                deploy-mongo
                exit 0
                ;;
            frontend)
                deploy-frontend
                exit 0
                ;;
            backend)
                deploy-backend
                exit 0
                ;;
            all)
                deploy-secret
                deploy-mongo
                deploy-backend
                deploy-frontend
                exit 0
                ;;
            help | -h | --help)
                log_green "Usage: `basename ${0}` deploy [secret|mongo|frontend|backend|all]"
                log_green "Deploys manifests to Kubernetes."
                exit 0
                ;;
            *)
                log_red "Invalid option."
                log_red "Usage: `basename ${0}` deploy [secret|mongo|frontend|backend|all]"
                exit 1
                ;;
        esac
        ;;
    clean)
        cleanup
        exit 0
        ;;
    help | -h | --help)
        log_green "Usage: `basename ${0}` [generate|build|deploy|clean|help] [args ...]"
        log_green "Script to build and deploy Knowzone project."
        exit 0
        ;;
    *)
        log_red "Invalid option. Type '`basename ${0}` help' for available commands."
        exit 1
        ;;
esac
