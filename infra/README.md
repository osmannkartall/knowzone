# Infrastructure

## Table of Contents

- [Infrastructure](#infrastructure)
  - [Table of Contents](#table-of-contents)
  - [Running on Azure Kubernetes Service Cluster](#running-on-azure-kubernetes-service-cluster)
    - [Pre-requisites](#pre-requisites)
    - [Creating an Azure Container Registry](#creating-an-azure-container-registry)
      - [Testing Azure Container Registry](#testing-azure-container-registry)
    - [Creating an Azure Kubernetes Service cluster](#creating-an-azure-kubernetes-service-cluster)
      - [Stopping - Starting AKS cluster](#stopping---starting-aks-cluster)
    - [Deploy Knowzone to AKS](#deploy-knowzone-to-aks)

## Running on Azure Kubernetes Service Cluster  

### Pre-requisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)  
- [Docker](https://docs.docker.com/engine/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)  
- [git](https://git-scm.com/downloads)  

### Creating an Azure Container Registry  

For convenience, we can use variables for all the commands for creating resources. Set below variables to your preferred values.  
REGISTRY_PREFIX variable should be a unique name for creating Azure Container Registry.  
LOCATION variable should be set to any available location for Azure (e.g. westeurope). You can list the locations with `az account list-locations -o table`  

```bash
RESOURCE_GROUP="YOUR-RESOURCE-GROUP"
REGISTRY_PREFIX="YOUR-REGISTRY-NAME"
LOCATION="YOUR-LOCATION"
CLUSTER_NAME="YOUR-CLUSTER-NAME"
```

```bash
# Login to Azure, opens up a new browser window for you to login
az login

# Creates a resource group named "${RESOURCE_GROUP}" located in "West Europe"
az group create --name ${RESOURCE_GROUP} --location ${LOCATION}

# Creates a container registry inside the resource group
# The container registry name MUST be unique
az acr create --resource-group ${RESOURCE_GROUP} \
  --name ${REGISTRY_PREFIX} --sku Basic

# Login to the container registry you've created
az acr login --name ${REGISTRY_PREFIX}
```

#### Testing Azure Container Registry  

```bash
# Pull an image from ACR
docker pull mcr.microsoft.com/hello-world

# Tag the image with the ACR login server name
docker tag mcr.microsoft.com/hello-world ${REGISTRY_PREFIX}.azurecr.io/hello-world:v1

# Push the image to ACR
docker push ${REGISTRY_PREFIX}.azurecr.io/hello-world:v1

# List the images in ACR
az acr repository list --name ${REGISTRY_PREFIX} --output table

# Delete the image from your local machine
docker rmi ${REGISTRY_PREFIX}.azurecr.io/hello-world:v1

# Delete the image from ACR
az acr repository delete --name ${REGISTRY_PREFIX} --image hello-world:v1
```

### Creating an Azure Kubernetes Service cluster

```bash
# Enable the Container Service
az provider register --namespace Microsoft.ContainerService
# Enable the Storage Service for ReadWriteMany supported Storage Classes
az provider register --namespace Microsoft.Storage

# Create a 2-Node AKS cluster with ACR attached
# Each machine has 2vCPU, 8 GB RAM, and 50 GB storage
# You can list all VM sizes with `az vm list-sizes --location westeurope --output table`
az aks create \
    --resource-group ${RESOURCE_GROUP} \
    --name ${CLUSTER_NAME} \
    --node-vm-size Standard_D2_v3 \
    --node-count 2 \
    --generate-ssh-keys \
    --attach-acr ${REGISTRY_PREFIX}

# Create a context in your kubeconfig file
az aks get-credentials --resource-group ${RESOURCE_GROUP} --name ${CLUSTER_NAME}

# Test the connection with AKS nodes
kubectl get nodes
```

#### Stopping - Starting AKS cluster  

To optimize your costs, you can stop the Kubernetes cluster when not in use.  

```bash
# Stop the cluster
az aks stop --name ${CLUSTER_NAME} --resource-group ${RESOURCE_GROUP}

# Start the cluster
az aks start --name ${CLUSTER_NAME} --resource-group ${RESOURCE_GROUP}
```

### Deploy Knowzone to AKS  

To build and deploy the project to AKS, make sure you are logged in to ACR, and properly connected to AKS via kubectl.

Change the **export** lines within `init.sh`. Descriptions are given below:  

- REGISTRY_NAME: Full name for your registered ACR, e.g. myacr.azurecr.io  
- FRONTEND_LB_PREFIX: Prefix to generate the load balancer domain for frontend, e.g. myfrontend (full domain will be myfrontend.REGION.cloudapp.azure.com - REGION is your AKS location, e.g. westeurope)  
- FRONTEND_URL: Full name of frontend URL, e.g. "http://${FRONTEND_LB_PREFIX}.westeurope.cloudapp.azure.com"
- BACKEND_LB_PREFIX: Similar to FRONTEND_LB_PREFIX, for backend
- BACKEND_URL: Full name of backend URL, e.g. "http://${BACKEND_LB_PREFIX}.westeurope.cloudapp.azure.com"
- MONGO_PASSWORD: This will be put in Kubernetes secret, required for MongoDB creation and connection strings
- SESSION_SECRET: This will be put in Kubernetes secret, required to sign the session ID cookie
- VERSION: Version tag for Docker images

```bash
export REGISTRY_NAME="YOUR-FULL-AZURE-REGISTRY-NAME"
export FRONTEND_LB_PREFIX="YOUR-FRONTEND-PREFIX-URL"
export FRONTEND_URL="YOUR-FRONTEND-URL"
export BACKEND_LB_PREFIX="YOUR-BACKEND-PREFIX-URL"
export BACKEND_URL="YOUR-BACKEND-URL"
export MONGO_PASSWORD="YOUR-MONGO-PASSWORD"
export SESSION_SECRET="YOUR-CUSTOM-SESSION-SECRET"
export VERSION="YOUR-VERSION"
```

After replacing the environment variable values, you can deploy the whole project with below commands.

```bash
cd infra

# Generates manifests from templates
./init.sh generate

# Builds and pushes Docker images to ACR
./init.sh build all

# Deploys manifests to AKS
./init.sh deploy all
```

Available command tree is listed below.  

- **./init.sh**  
  - **generate** *--Generate manifests from templates*  
  - **build** *--Build images*  
    - **frontend**  
    - **backend**  
    - **all**  
    - **help**  
  - **deploy** *--Deploy generated manifests*  
    - **secret**  
    - **mongo**  
    - **frontend**  
    - **backend**  
    - **all**  
  - **clean** *--Clean up generated manifests and cloned MongoDB repo*  
  - **help**  

## Running on local Kubernetes cluster  

Tested on Linux (Ubuntu), macOS, and Windows.  
For Windows, running the cluster outside of WSL can cause performance issues. Install the tools in WSL and run the cluster in WSL.  

### Pre-requisites  

- [Docker](https://docs.docker.com/engine/install)  
  - Only the Docker CLI is required since we are using minikube's internal registry. If you are using Docker Desktop, you can stop Docker daemon by quitting the application.
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)  
- [minikube](https://minikube.sigs.k8s.io/docs/start)  
- [Tilt](https://docs.tilt.dev/install.html)  
  - Since we are using minikube, you can skip these steps in the Tilt installation:  
    - In the preferences, click Enable Kubernetes  
    - Make Docker for Windows (or Mac) your local Kubernetes cluster: kubectl config use-context docker-desktop  

- [git](https://git-scm.com/downloads)  

Make sure they are in the path by running:  

```bash
docker --version
kubectl version --client
minikube version
tilt version
git --version
```

### Running Startup Script  

```bash
cd infra
./init-local.sh run
```

Startup script is divided into 4 steps:  

1. Create a minikube cluster  
2. Generate Kubernetes manifests  
3. Deploy secret and MongoDB operator  
4. Run Tilt developer environment  

You can quit Tilt by pressing Ctrl-C. This does not remove the environment, you can start the development environment again with `tilt up`. If you want to remove the whole infrastructure, run `./init-local.sh clean`. This tears down the minikube cluster, removes the generated manifests and the cloned MongoDB repository.  
