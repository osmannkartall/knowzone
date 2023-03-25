const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const config = require('./config');
const helloController = require('./controllers/HelloController');
const formController = require('./controllers/FormController');
const postController = require('./controllers/PostController');
const searchController = require('./controllers/SearchController');
const authController = require('./controllers/AuthController');
const { handleError } = require('./middlewares/handleError');
const { handleNotFound } = require('./middlewares/handleNotFound');

async function startDB() {
  try {
    await mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
  app.use('/forms', formController);
  app.use('/posts', postController);
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

  app.use(express.static(process.env.PUBLIC_UPLOAD_PATH));

  app.get('/', (req, res) => {
    res.send('Knowzone Backend');
  });

  addControllers(app);

  app.use(handleNotFound);

  app.use(handleError);

  app.listen(port, () => {
    console.log(`Knowzone backend listening at http://localhost:${port}`);
  });
}

async function start() {
  await startDB();
  await startExpress();
}

start();
