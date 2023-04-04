import express from 'express';

import enableEnvs from './config/enableEnvs.js';
import enableCors from './config/enableCors.js';
import addStaticServer from './config/addStaticServer.js';
import createSession from './config/createSession.js';
import connectRoutes from './config/connectRoutes.js';
import handleNotFound from './config/handleNotFound.js';
import handleError from './config/handleError.js';
import startDB from './config/startDB.js';

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
