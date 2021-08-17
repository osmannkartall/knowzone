const mongoose = require('mongoose');
const express = require('express');
const config = require('./config');
const tipsController = require('./controllers/TipsController');
const helloController = require('./controllers/HelloController');
const bugFixesController = require('./controllers/BugFixesController');

async function startDB() {
  try {
    await mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log('Connected to the database!');
  } catch (err) {
    console.log('Cannot connect to the database!', err);
    process.exit();
  }
}

function addControllers(app) {
  app.use(`${config.api.prefix}/tips`, tipsController);
  app.use(`${config.api.prefix}/hello`, helloController);
  app.use(`${config.api.prefix}/bugfixes`, bugFixesController);
}

async function startExpress() {
  const app = express();
  const { port } = config;

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.get('/', (req, res) => {
    res.send('Knowzone Back-End');
  });

  addControllers(app);

  app.listen(port, () => {
    console.log(`Knowzone back-end listening at http://localhost:${port}`);
  });
}

async function start() {
  await startDB();
  await startExpress();
}

start();
