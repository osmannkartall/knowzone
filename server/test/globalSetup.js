const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const mockMongo = require('./mockMongo');

module.exports = async function globalSetup() {
  if (mockMongo.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    // it's needed in global space, because we don't want to create a new instance every test-suite
    const instance = await MongoMemoryServer.create();
    const uri = instance.getUri();
    // eslint-disable-next-line no-underscore-dangle
    global.__MONGOINSTANCE = instance;
    process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  } else {
    process.env.MONGO_URI = `mongodb://${mockMongo.IP}:${mockMongo.Port}`;
  }

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(`${process.env.MONGO_URI}/${mockMongo.Database}`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};
