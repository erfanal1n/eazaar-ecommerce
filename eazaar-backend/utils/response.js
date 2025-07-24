/**
 * Standardized response utility for consistent API responses
 */

const sendResponse = (res, statusCode, message, data = null, error = null) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (error !== null) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  sendResponse
};