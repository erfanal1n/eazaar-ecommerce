
// Enhanced API logging middleware
const createEnhancedLogger = require('../utils/enhancedLogger');
const logger = createEnhancedLogger('API_MIDDLEWARE');

const heroSliderAPILogger = (req, res, next) => {
  // Only log hero slider related requests
  if (req.path.includes('test-hero') || req.path.includes('banner')) {
    const startTime = Date.now();
    const traceId = Math.random().toString(36).substr(2, 9);
    
    // Add trace ID to request
    req.traceId = traceId;
    
    logger.info('API Request Started', {
      traceId,
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.method !== 'GET' ? req.body : undefined,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      ip: req.ip
    });
    
    // Override res.json to log responses
    const originalJson = res.json;
    res.json = function(data) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      logger.info('API Response Completed', {
        traceId,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        dataSize: JSON.stringify(data).length,
        bannersCount: data.banners ? data.banners.length : undefined,
        success: res.statusCode < 400
      });
      
      // Log detailed data for debugging
      if (data.banners && data.banners.length > 0) {
        logger.debug('Response Data Details', {
          traceId,
          banners: data.banners.map(banner => ({
            id: banner._id,
            title: banner.content?.title,
            isActive: banner.isActive,
            lastUpdated: banner.updatedAt,
            hasDisplaySettings: !!banner.displaySettings,
            hasAnimationSettings: !!banner.animationSettings,
            hasElementVisibility: !!banner.elementVisibility
          }))
        });
      }
      
      return originalJson.call(this, data);
    };
    
    // Override res.status to log errors
    const originalStatus = res.status;
    res.status = function(code) {
      if (code >= 400) {
        logger.error('API Error Response', {
          traceId,
          statusCode: code,
          path: req.path,
          method: req.method
        });
      }
      return originalStatus.call(this, code);
    };
  }
  
  next();
};

module.exports = heroSliderAPILogger;
