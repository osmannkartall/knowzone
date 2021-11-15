const dotenv = require('dotenv');
const crypto = require('crypto');
const MongoStore = require('connect-mongo');

const result = dotenv.config();

if (result.error) {
  // .env file is not used in production. Avoid throwing error.
  if (process.env.NODE_ENV !== 'production' || result.error.code !== 'ENOENT') {
    throw result.error;
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10),

  corsOptions: {
    origin: process.env.REACT_URL,
    credentials: true,
  },

  sessionOptions: {
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    genid: () => crypto.randomBytes(64).toString('hex').toUpperCase(),
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: parseInt(process.env.SESSION_LIFETIME, 10),
      sameSite: true,
      secure: process.env.SESSION_SECURE === 'true',
    },
  },

  databaseURL: process.env.MONGODB_URI,
};
