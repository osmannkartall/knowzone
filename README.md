# Knowzone

[![Backend Unit Tests](https://github.com/osmannkartall/knowzone/actions/workflows/backend-unit-tests.yml/badge.svg?branch=master)](https://github.com/osmannkartall/knowzone/actions/workflows/backend-unit-tests.yml)  
[![UI Tests](https://github.com/osmannkartall/knowzone/actions/workflows/ui-tests.yml/badge.svg?branch=master)](https://github.com/osmannkartall/knowzone/actions/workflows/ui-tests.yml)  

Knowzone is a knowledge sharing application. Create your custom forms and share with others.

![demo](assets/demo.png)

## Table of Contents

- [Knowzone](#knowzone)
  - [Table of Contents](#table-of-contents)
  - [Using the App](#using-the-app)
    - [Backup and Restore Application Data](#backup-and-restore-application-data)
  - [Development](#development)
    - [Installations](#installations)
    - [Running](#running)
      - [MongoDB](#mongodb)
      - [Node Express](#node-express)
      - [React](#react)
  - [Running on Azure Kubernetes Service Cluster or Local Kubernetes Cluster](#running-on-azure-kubernetes-service-cluster-or-local-kubernetes-cluster)

## Using the App

Run `docker compose up -d` command once and it's ready to go. You can access the application from the browser via `http://localhost:3005`.

### Backup and Restore Application Data

Backup database and file server by running the following command

```bash
./backup_restore.sh backup
```

You can restore your database and file server after `docker compose up -d` by running the following command

```bash
./backup_restore.sh restore
```

## Development

### Installations

- Install [Node.js](https://nodejs.org/en/download/)
- Install [npm](https://www.npmjs.com/package/npm)
- **Optional**: Install [MongoDB Compass](https://docs.mongodb.com/compass/current/install/). This is a nice desktop application for MongoDB.

### Running

#### MongoDB

> **Caution**: This is not production setup. You can refer to [Authentication](https://www.mongodb.com/docs/manual/core/authentication/) and [Deploy Replica Set With Keyfile Authentication](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set-with-keyfile-access-control/) for additional information.

Run a mongo db in a docker container with a persistent volume called `dev-mongo-data`. This will create a single node replica set. This is necessary to run transactions in MongoDB.

```bash
./init-db.sh
```

**Optional**: Create a connection from MongoDB Compass. Set URI to `mongodb://localhost:27017/?replicaSet=rs0&directConnection=true` and press the connect button.

#### Node Express

```bash
cd server
```

Create `.env` file with the values below. **Note**: Ideally, this file should not be checked in.

```bash
PORT=8000
MONGODB_URI=mongodb://localhost:27017/knowzone?replicaSet=rs0&directConnection=true
REACT_URL=http://localhost:3005
SESSION_SECRET=knowzone-auth-secret
SESSION_NAME=sid
SESSION_LIFETIME=3600000
SESSION_SECURE=false
PUBLIC_UPLOAD_PATH=./uploads
IMAGE_UPLOAD_SUBPATH=images
```

Note: Install dependencies if you run the application for the first time. Otherwise, you can skip this step.

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

#### React

```bash
cd web
```

Create `.env` file with the values below.

```bash
PORT=3005
ESLINT_NO_DEV_ERRORS=true
REACT_APP_KNOWZONE_BE_URI=http://localhost:8000
REACT_APP_KNOWZONE_FE_URI=http://localhost:3005
```

Install dependencies.

```bash
npm install
```

Run the application.

```bash
npm start
```

### Data Generator

You can generate fake data by using the following command.

```bash
cd server

npm run data-generator
```

## Running on Azure Kubernetes Service Cluster or Local Kubernetes Cluster

Please refer the guide inside [infra](https://github.com/osmannkartall/knowzone/tree/master/infra) directory.
