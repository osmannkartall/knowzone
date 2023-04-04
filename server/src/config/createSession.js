import crypto from 'crypto';
import session from 'express-session';
import MongoStore from 'connect-mongo';

function createSession() {
  const sessionOptions = {
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
  };

  return session(sessionOptions);
}

export default createSession;
