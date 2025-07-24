const analyticsService = require('../services/analytics.service');

// Get business overview analytics
const getBusinessOverview = async (req, res) => {
  try {
    const data = await analyticsService.getBusinessOverviewData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching business overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business overview data',
      error: error.message
    });
  }
};

// Get sales and products analytics
const getSalesProducts = async (req, res) => {
  try {
    const data = await analyticsService.getSalesProductsData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching sales products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales products data',
      error: error.message
    });
  }
};

// Get customer insights analytics
const getCustomerInsights = async (req, res) => {
  try {
    const data = await analyticsService.getCustomerInsightsData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching customer insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer insights data',
      error: error.message
    });
  }
};

// Get reports data
const getReportsData = async (req, res) => {
  try {
    const data = await analyticsService.getReportsData();
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching reports data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reports data',
      error: error.message
    });
  }
};

// Get sales report data
const getSalesReportData = async (req, res) => {
  try {
    const { dateRange } = req.query;
    const data = await analyticsService.getSalesReportData(dateRange || 'last30days');
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching sales report data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sales report data',
      error: error.message
    });
  }
};

// Get customer report data
const getCustomerReportData = async (req, res) => {
  try {
    const { dateRange } = req.query;
    const data = await analyticsService.getCustomerReportData(dateRange || 'last30days');
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching customer report data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer report data',
      error: error.message
    });
  }
};

// Get product report data
const getProductReportData = async (req, res) => {
  try {
    const { dateRange } = req.query;
    const data = await analyticsService.getProductReportData(dateRange || 'last30days');
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching product report data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product report data',
      error: error.message
    });
  }
};

module.exports = {
  getBusinessOverview,
  getSalesProducts,
  getCustomerInsights,
  getReportsData,
  getSalesReportData,
  getCustomerReportData,
  getProductReportData
};