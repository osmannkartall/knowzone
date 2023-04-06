import express from 'express';
import process from 'node:process';
import mongoose from 'mongoose';

import enableEnvs from './config/enableEnvs.js';
import enableCors from './config/enableCors.js';
import addStaticServer from './config/addStaticServer.js';
import createSession from './config/createSession.js';
import connectRoutes from './config/connectRoutes.js';
import handleNotFound from './config/handleNotFound.js';
import handleError from './config/handleError.js';
import startDB from './config/startDB.js';

let server;

function createServer(app) {
  const port = process.env.port ?? 8000;

  console.log('> creating the http server...');
  try {
    server = app.listen(port, () => {
      console.log(`> http server is listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.log('> cannot create the http server');
  }
}

function startExpress() {
  const app = express();

  app.use(enableCors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(addStaticServer());
  app.use(createSession());
  connectRoutes(app);
  app.use(handleNotFound);
  app.use(handleError);

  console.log('knowzone - backend\n----');
  createServer(app);
}

async function start() {
  enableEnvs();
  await startDB();
  startExpress();
}

start();

function handleShutdown() {
  console.log('\n> exiting backend...');

  if (server && server.close) {
    server.close(() => {
      console.log('> http server is closed');
    });
  }

  console.log('> closing mongodb connections...');
  mongoose.disconnect();
  console.log('> closed mongodb connections');
  console.log('\ndone');

  process.exit();
}

process.on('SIGINT', handleShutdown);

process.on('SIGTERM', handleShutdown);
