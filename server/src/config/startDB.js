import mongoose from 'mongoose';

async function startDB() {
  try {
    console.log('knowzone - mongodb\n----');
    console.log('> trying to connect to the database...');
    await mongoose.connect(
      process.env.MONGODB_URI,
      {
        // replicaSet: 'rs0',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log('> connected to the database');
  } catch (err) {
    console.log('> cannot connect to the database:', err.message);
    process.exit();
  }
}

export default startDB;
