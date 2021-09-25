# Running on Azure Kubernetes Service Cluster  

## Table of Contents

- [Running on Azure Kubernetes Service Cluster](#running-on-azure-kubernetes-service-cluster)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
  - [Creating an Azure Container Registry](#creating-an-azure-container-registry)
    - [Testing Azure Container Registry](#testing-azure-container-registry)
  - [Creating an Azure Kubernetes Service cluster](#creating-an-azure-kubernetes-service-cluster)
    - [Stopping - Starting AKS cluster](#stopping---starting-aks-cluster)
  - [Deploy Knowzone to AKS](#deploy-knowzone-to-aks)

## Pre-requisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)  
- [Docker](https://docs.docker.com/engine/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)  
- [git](https://git-scm.com/downloads)  

## Creating an Azure Container Registry  

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

### Testing Azure Container Registry  

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

## Creating an Azure Kubernetes Service cluster

```bash
# Enable the Container Service
az provider register --namespace Microsoft.ContainerService

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

### Stopping - Starting AKS cluster  

To optimize your costs, you can stop the Kubernetes cluster when not in use.  

```bash
# Stop the cluster
az aks stop --name ${CLUSTER_NAME} --resource-group ${RESOURCE_GROUP}

# Start the cluster
az aks start --name ${CLUSTER_NAME} --resource-group ${RESOURCE_GROUP}
```

## Deploy Knowzone to AKS  

To build and deploy the project to AKS, make sure you are logged in to ACR, and properly connected to AKS via kubectl.

Change the **export** lines within `init.sh`. Descriptions are given below:  

- REGISTRY_NAME: Full name for your registered ACR, e.g. myacr.azurecr.io  
- FRONTEND_LB_PREFIX: Prefix to generate the load balancer domain for frontend, e.g. myfrontend (full domain will be myfrontend.REGION.cloudapp.azure.com - REGION is your AKS location, e.g. westeurope)  
- BACKEND_LB_PREFIX: Similar to FRONTEND_LB_PREFIX, for backend
- MONGO_PASSWORD: This will be put in Kubernetes secret, required for MongoDB creation and connection strings.
- VERSION: Version tag for Docker images

```bash
export REGISTRY_NAME="YOUR-FULL-AZURE-REGISTRY-NAME"
export FRONTEND_LB_PREFIX="YOUR-FRONTEND-PREFIX-URL"
export BACKEND_LB_PREFIX="YOUR-BACKEND-PREFIX-URL"
export MONGO_PASSWORD="YOUR-MONGO-PASSWORD"
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
