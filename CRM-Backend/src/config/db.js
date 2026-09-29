const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mini_crm';
    
    // Set mongoose options
    mongoose.set('strictQuery', false);

    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      if (process.env.USE_MEMORY_DB_FALLBACK === 'true') {
        console.log('Local MongoDB connection failed. Falling back to in-memory MongoDB server...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`In-Memory MongoDB Server Connected: ${conn.connection.host}`);
        return conn;
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
