const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

// local url 
const DB_URL = 'mongodb://0.0.0.0:27017/eazaar'; 
// mongodb url
const MONGO_URI = secret.db_url;

const connectDB = async () => {
  try { 
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });
    console.log('mongodb connection success!');
    return mongoose.connection;
  } catch (err) {
    console.log('mongodb connection failed!', err.message);
    throw err;
  }
};

module.exports = connectDB;
