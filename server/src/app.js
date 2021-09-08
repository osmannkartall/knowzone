const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const config = require('./config');
const tipController = require('./controllers/TipController');
const helloController = require('./controllers/HelloController');
const bugFixController = require('./controllers/BugFixController');
const searchController = require('./controllers/SearchController');
const authController = require('./controllers/AuthController');

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
  // Add route names for repositories in plural form.
  app.use(`${config.api.prefix}/hello`, helloController);
  app.use(`${config.api.prefix}/tips`, tipController);
  app.use(`${config.api.prefix}/bugfixes`, bugFixController);
  app.use(`${config.api.prefix}/search`, searchController);
  app.use(`${config.api.prefix}/`, authController);
}

async function startExpress() {
  const app = express();
  const { port, corsOptions } = config;

  app.use(cors(corsOptions));

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
