const dotenv = require('dotenv');

function enableEnvs() {
  const result = dotenv.config();

  if (result.error) {
    // .env file is not used in production. Avoid throwing error.
    if (process.env.NODE_ENV !== 'production' || result.error.code !== 'ENOENT') {
      throw result.error;
    }
  }

  const {
    REACT_URL,
    MONGODB_URI,
    SESSION_LIFETIME,
    SESSION_NAME,
    SESSION_SECRET,
    SESSION_SECURE,
    PUBLIC_UPLOAD_PATH,
  } = process.env;

  if (!REACT_URL) {
    throw Error('Cannot find cors-origin address');
  }

  if (!MONGODB_URI) {
    throw Error('Cannot find database connection url');
  }

  if (!SESSION_NAME || !SESSION_SECRET || !SESSION_LIFETIME || !SESSION_SECURE) {
    throw Error('Missing session data');
  }

  if (!PUBLIC_UPLOAD_PATH) {
    throw Error('Missing path for uploaded images');
  }
}

module.exports = enableEnvs;
