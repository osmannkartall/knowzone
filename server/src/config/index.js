const dotenv = require('dotenv');

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
  },

  databaseURL: process.env.MONGODB_URI,

  api: {
    prefix: '/api',
  },
};
