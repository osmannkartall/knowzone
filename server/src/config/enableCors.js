import cors from 'cors';

function enableCors() {
  const CORS_OPTIONS = { origin: process.env.REACT_URL, credentials: true };

  return cors(CORS_OPTIONS);
}

export default enableCors;
