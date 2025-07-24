
// Enhanced logging for testHeroBannerController.js
const fs = require('fs');
const path = require('path');

// Create enhanced logger
const createEnhancedLogger = (controllerName) => {
  const logFile = path.join(__dirname, '../logs', `${controllerName}-${new Date().toISOString().split('T')[0]}.log`);
  
  const log = (level, message, data = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      controller: controllerName,
      message,
      data,
      traceId: Math.random().toString(36).substr(2, 9)
    };
    
    // Console output
    console.log(`[${level}] ${controllerName}: ${message}`, data);
    
    // File output
    try {
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('Failed to write log:', error.message);
    }
    
    return logEntry.traceId;
  };
  
  return {
    info: (message, data) => log('INFO', message, data),
    warn: (message, data) => log('WARN', message, data),
    error: (message, data) => log('ERROR', message, data),
    debug: (message, data) => log('DEBUG', message, data),
    trace: (message, data) => log('TRACE', message, data)
  };
};

module.exports = createEnhancedLogger;
