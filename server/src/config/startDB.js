const mongoose = require('mongoose');

async function startDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('Connected to the database!');
  } catch (err) {
    console.log('Cannot connect to the database!', err);
    process.exit();
  }
}

module.exports = startDB;
