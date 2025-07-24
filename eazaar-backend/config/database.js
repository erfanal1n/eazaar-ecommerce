const mongoose = require('mongoose');
const { secret } = require('./secret');

// MongoDB connection configuration
const connectDB = async () => {
  try {
    // Connection options for better performance and security
    const options = {
      // Use new URL parser
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Connection pool settings
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      
      // Buffering settings
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
      
      // Authentication and security
      authSource: 'admin', // Specify the database to authenticate against
      
      // Replica set and sharding
      readPreference: 'primary', // Read from primary by default
      
      // Compression
      compressors: ['zlib'], // Enable compression
      
      // Heartbeat and monitoring
      heartbeatFrequencyMS: 10000, // Send heartbeat every 10 seconds
      
      // Index management
      autoIndex: process.env.NODE_ENV !== 'production', // Build indexes in development only
      autoCreate: process.env.NODE_ENV !== 'production', // Create collections in development only
    };

    // Choose connection URL based on environment
    const mongoURI = secret.db_url || 'mongodb://0.0.0.0:27017/eazaar';
    
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 Database URL: ${mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Connected to: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during MongoDB disconnection:', error);
        process.exit(1);
      }
    });
    
    return conn;
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Log specific connection errors
    if (error.name === 'MongoNetworkError') {
      console.error('🌐 Network error - Check your internet connection and MongoDB server');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('🔐 Authentication error - Check your MongoDB credentials');
    } else if (error.name === 'MongoParseError') {
      console.error('🔗 Connection string error - Check your MongoDB URI format');
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Create database indexes for better performance
 */
const createIndexes = async () => {
  try {
    console.log('🔍 Creating database indexes...');
    
    const User = require('../models/UserNew');
    
    // Create indexes for User model
    await User.createIndexes();
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

/**
 * Clean up expired tokens and sessions
 */
const cleanupExpiredData = async () => {
  try {
    console.log('🧹 Cleaning up expired data...');
    
    const User = require('../models/UserNew');
    
    // Clean up expired email verification and password reset tokens
    await User.cleanupExpiredTokens();
    
    // Clean up expired refresh tokens
    await User.updateMany(
      {},
      {
        $pull: {
          refreshTokens: {
            expiresAt: { $lt: new Date() }
          }
        }
      }
    );
    
    console.log('✅ Expired data cleanup completed');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
};

/**
 * Database health check
 */
const healthCheck = async () => {
  try {
    const admin = mongoose.connection.db.admin();
    const result = await admin.ping();
    
    if (result.ok === 1) {
      console.log('💚 Database health check: OK');
      return true;
    } else {
      console.log('💔 Database health check: FAILED');
      return false;
    }
  } catch (error) {
    console.error('❌ Database health check error:', error);
    return false;
  }
};

/**
 * Get database statistics
 */
const getDatabaseStats = async () => {
  try {
    const stats = await mongoose.connection.db.stats();
    
    console.log('📊 Database Statistics:');
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Indexes: ${stats.indexes}`);
    console.log(`   Index Size: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
    
    return stats;
  } catch (error) {
    console.error('❌ Error getting database stats:', error);
    return null;
  }
};

/**
 * Setup periodic cleanup job
 */
const setupPeriodicCleanup = () => {
  // Run cleanup every 24 hours
  setInterval(async () => {
    console.log('🕐 Running periodic cleanup...');
    await cleanupExpiredData();
  }, 24 * 60 * 60 * 1000); // 24 hours
  
  console.log('⏰ Periodic cleanup job scheduled (every 24 hours)');
};

module.exports = {
  connectDB,
  createIndexes,
  cleanupExpiredData,
  healthCheck,
  getDatabaseStats,
  setupPeriodicCleanup
};