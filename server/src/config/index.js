const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

module.exports = {
  port: parseInt(process.env.PORT, 10),

  corsOptions: {
    origin: 'http://localhost:3000',
  },

  databaseURL: process.env.MONGODB_URI,

  api: {
    prefix: '/api',
  },
};
