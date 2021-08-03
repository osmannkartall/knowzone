# Knowzone

# Installations

* Install [Node.js, version: 14.17.4](https://nodejs.org/en/download/)
* Install [npm](https://www.npmjs.com/package/npm)

  Note: You may not have to install npm separetly but make sure that npm version is 7.20.3 if it comes with Node installation.

  Check the installed version of npm.

  ```bash
  npm -v
  ```

  If npm installed on your development environment already, you can update it to a specific version.
  
  ```bash
  npm install -g npm@7.20.3
  ```

* Install [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/) and make sure that you are able to run mongo shell with mongosh command in a terminal after the installation. Otherwise, you may need to install separetly. [Details](https://www.mongodb.com/try/download/shell)
* Install [MongoDB Compass](https://docs.mongodb.com/compass/current/install/). This is a nice desktop application for MongoDB. Note: This, may already come with the MongoDB Community Installer.

## VS Code Extensions

* Path Intellisense by Christian Kohler
* npm Intellisense by Christian Kohler
* npm by egamma
* ESLint by Dirk Baeumer
* ES7 React/Redux/GraphQL/React-Native snippets by dsznajder
* react native tools by Microsoft (This is not necessary for the web project)
* Prettier - Code formatter by Prettier

# Running

## Node Express

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

## React

```bash
cd web
```

Note: Install dependecies if you run the application for the first time. Otherwise, you can skip this step. 

```bash
npm install
```

Run the application.

```bash
npm start
```
