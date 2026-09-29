const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini_crm';
    
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`Database Connection Error: ${err.message}`);
    if (process.env.USE_MEMORY_DB_FALLBACK === 'true' && !process.env.VERCEL) {
      console.log('Local MongoDB connection failed. Falling back to in-memory MongoDB server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      isConnected = true;
      console.log(`In-Memory MongoDB Server Connected: ${conn.connection.host}`);
      return conn;
    }
    throw err;
  }
};

module.exports = connectDB;

