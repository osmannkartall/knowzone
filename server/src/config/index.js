const dotenv = require('dotenv');

const result = dotenv.config();

if (result.error) {
  let throwError = true;

  // .env file is not used in production so avoid throwing error.
  if (process.env.NODE_ENV === 'production' && result.error.code === 'ENOENT')
    throwError = false;
  if (throwError)
    throw result.error;
}

module.exports = {
  port: parseInt(process.env.PORT, 10),

  corsOptions: {
    origin: process.env.REACT_URL,
  },

  databaseURL: process.env.MONGODB_URI,

  api: {
    prefix: '/api',
  },
};
