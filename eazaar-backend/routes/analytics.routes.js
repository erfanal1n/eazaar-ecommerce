const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analytics.controller');

// No authentication required - matching dashboard pattern

// Business overview analytics
router.get('/business-overview', analyticsController.getBusinessOverview);

// Sales and products analytics
router.get('/sales-products', analyticsController.getSalesProducts);

// Customer insights analytics
router.get('/customer-insights', analyticsController.getCustomerInsights);

// Reports data
router.get('/reports-data', analyticsController.getReportsData);
router.get('/sales-report', analyticsController.getSalesReportData);
router.get('/customer-report', analyticsController.getCustomerReportData);
router.get('/product-report', analyticsController.getProductReportData);

module.exports = router;