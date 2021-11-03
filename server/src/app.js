const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const config = require('./config');
const tipController = require('./controllers/TipController');
const helloController = require('./controllers/HelloController');
const bugfixController = require('./controllers/BugfixController');
const searchController = require('./controllers/SearchController');
const authController = require('./controllers/AuthController');
const { handleError, KNOWZONE_ERROR_TYPES } = require('./middlewares/errorHandler');
const KnowzoneError = require('./KnowzoneError');

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
  app.use('/hello', helloController);
  app.use('/tips', tipController);
  app.use('/bugfixes', bugfixController);
  app.use('/search', searchController);
  app.use('/', authController);
}

async function startExpress() {
  const app = express();
  const { port, corsOptions, sessionOptions } = config;

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(session(sessionOptions));

  app.get('/', (req, res) => {
    res.send('Knowzone Back-End');
  });

  addControllers(app);

  app.use((req, res, next) => {
    next(new KnowzoneError({
      type: KNOWZONE_ERROR_TYPES.NOT_FOUND,
      code: 404,
      description: 'Not Found',
    }));
  });

  app.use(handleError);

  app.listen(port, () => {
    console.log(`Knowzone back-end listening at http://localhost:${port}`);
  });
}

async function start() {
  await startDB();
  await startExpress();
}

start();
