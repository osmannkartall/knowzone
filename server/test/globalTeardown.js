const mockMongo = require('./mockMongo');

module.exports = async function globalTeardown() {
  if (mockMongo.Memory) { // Config to decided if an mongodb-memory-server instance should be used
    // eslint-disable-next-line no-underscore-dangle
    const instance = global.__MONGOINSTANCE;
    await instance.stop();
  }
};
