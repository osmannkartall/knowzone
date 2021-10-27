# Knowzone

[![Build and deploy backend to AKS](https://github.com/osmannkartall/knowzone/actions/workflows/aks-deploy-backend.yml/badge.svg?branch=master)](https://github.com/osmannkartall/knowzone/actions/workflows/aks-deploy-backend.yml)  
[![Build and deploy frontend to AKS](https://github.com/osmannkartall/knowzone/actions/workflows/aks-deploy-frontend.yml/badge.svg?branch=master)](https://github.com/osmannkartall/knowzone/actions/workflows/aks-deploy-frontend.yml)  

## Table of Contents

- [Knowzone](#knowzone)
  - [Table of Contents](#table-of-contents)
  - [Installations](#installations)
    - [VS Code Extensions](#vs-code-extensions)
  - [Running](#running)
    - [Node Express](#node-express)
    - [React](#react)
  - [Running on local Kubernetes cluster](#running-on-local-kubernetes-cluster)
    - [Pre-requisites](#pre-requisites)
      - [Notes](#notes)
    - [Running Startup Script](#running-startup-script)
  - [Running on Azure Kubernetes Service Cluster](#running-on-azure-kubernetes-service-cluster)

## Installations

- Install [Node.js, version: 14.17.4](https://nodejs.org/en/download/)
- Install [npm](https://www.npmjs.com/package/npm)

  Note: You may not have to install npm separetly but make sure that npm version is 7.20.3 if it comes with Node installation.

  Check the installed version of npm.

  ```bash
  npm -v
  ```

  If npm installed on your development environment already, you can update it to a specific version.
  
  ```bash
  npm install -g npm@7.20.3
  ```

- Install [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) and make sure that you are able to run mongo shell with mongosh command in a terminal after the installation. Otherwise, you may need to install separetly. [Details](https://www.mongodb.com/try/download/shell)
- Install [MongoDB Compass](https://docs.mongodb.com/compass/current/install/). This is a nice desktop application for MongoDB. Note: This, may already come with the MongoDB Community Installer.

### VS Code Extensions

- Path Intellisense by Christian Kohler
- npm Intellisense by Christian Kohler
- npm by egamma
- ESLint by Dirk Baeumer
- ES7 React/Redux/GraphQL/React-Native snippets by dsznajder
- react native tools by Microsoft (This is not necessary for the web project)

## Running

### Node Express

```bash
cd server
```

Note: Install dependecies if you run the application for the first time. Otherwise, you can skip this step.

```bash
npm install
```

Run the application on your development environment.

```bash
# This will execute the command corresponding to the dev property
# under the scripts object in server/package.json
npm run dev
```

[See the details of the architecture used in the Node.js project.](https://github.com/osmannkartall/knowzone/blob/master/server/ARCHITECTURE.MD)

### React

```bash
cd web
```

Install dependencies.

```bash
npm install
```

Run the application.

```bash
npm start
```

## Running on local Kubernetes cluster  

Tested on Linux (Ubuntu), macOS, and Windows.  
For Windows, running the cluster outside of WSL can cause performance issues. Install the tools in WSL and run the cluster in WSL.  

### Pre-requisites  

- [Docker](https://docs.docker.com/engine/install)  
- [kubectl](https://kubernetes.io/docs/tasks/tools/#kubectl)  
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)  
- [Tilt](https://docs.tilt.dev/install.html)

    Since we are using Kind, you can skip these steps in the Tilt installation:

  - In the preferences, click Enable Kubernetes
  - Make Docker for Windows (or Mac) your local Kubernetes cluster: kubectl config use-context docker-desktop

- [git](https://git-scm.com/downloads)  

Make sure they are in the path by running:  

```bash
docker --version
kubectl version --client
kind --version
tilt version
git --version
```

### Running Startup Script  

```bash
cd infra
./init-local.sh run
```

Startup script is divided into 4 steps:  

1. Create a Kind cluster  
2. Generate Kubernetes manifests  
3. Deploy secret and MongoDB operator  
4. Run Tilt developer environment  

You can quit Tilt by pressing Ctrl-C. This does not remove the environment, you can start the development environment again with `tilt up`. If you want to remove the whole infrastructure, run `./init-local.sh clean`. This tears down the Kind cluster, removes the generated manifests and the cloned MongoDB repository.  

## Running on Azure Kubernetes Service Cluster  

Please refer the guide inside [infra](https://github.com/osmannkartall/knowzone/tree/master/infra) directory.
