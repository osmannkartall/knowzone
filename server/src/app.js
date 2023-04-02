const express = require('express');

const enableEnvs = require('./config/enableEnvs');
const enableCors = require('./config/enableCors');
const addStaticServer = require('./config/addStaticServer');
const createSession = require('./config/createSession');
const connectRoutes = require('./config/connectRoutes');
const handleNotFound = require('./config/handleNotFound');
const handleError = require('./config/handleError');
const startDB = require('./config/startDB');

async function startExpress() {
  const app = express();

  app.use(enableCors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(addStaticServer());
  app.use(createSession());
  connectRoutes(app);
  app.use(handleNotFound);
  app.use(handleError);

  app.listen(process.env.port ?? 8000, () => {
    console.log(`Knowzone backend listening at http://localhost:${process.env.port ?? 8000}`);
  });
}

async function start() {
  enableEnvs();
  await startDB();
  await startExpress();
}

start();
