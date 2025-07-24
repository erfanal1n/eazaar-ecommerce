const CurrencyConfig = require('../model/CurrencyConfig');
const { sendResponse } = require('../utils/response');

// Get all currencies
const getAllCurrencies = async (req, res) => {
  try {
    const { active } = req.query;
    
    let query = {};
    if (active === 'true') {
      query.isActive = true;
    }
    
    const currencies = await CurrencyConfig.find(query)
      .sort({ isDefault: -1, name: 1 });
    
    sendResponse(res, 200, 'Currencies retrieved successfully', currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    sendResponse(res, 500, 'Error fetching currencies', null, error.message);
  }
};

// Get default currency
const getDefaultCurrency = async (req, res) => {
  try {
    const defaultCurrency = await CurrencyConfig.getDefault();
    
    if (!defaultCurrency) {
      return sendResponse(res, 404, 'No default currency found');
    }
    
    sendResponse(res, 200, 'Default currency retrieved successfully', defaultCurrency);
  } catch (error) {
    console.error('Error fetching default currency:', error);
    sendResponse(res, 500, 'Error fetching default currency', null, error.message);
  }
};

// Get currency by ID
const getCurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await CurrencyConfig.findById(id);
    
    if (!currency) {
      return sendResponse(res, 404, 'Currency not found');
    }
    
    sendResponse(res, 200, 'Currency retrieved successfully', currency);
  } catch (error) {
    console.error('Error fetching currency:', error);
    sendResponse(res, 500, 'Error fetching currency', null, error.message);
  }
};

// Create new currency
const createCurrency = async (req, res) => {
  try {
    const currencyData = req.body;
    
    // Check if currency code already exists
    const existingCurrency = await CurrencyConfig.findOne({ 
      code: currencyData.code.toUpperCase() 
    });
    
    if (existingCurrency) {
      return sendResponse(res, 400, 'Currency with this code already exists');
    }
    
    // If this is the first currency, make it default
    const currencyCount = await CurrencyConfig.countDocuments();
    if (currencyCount === 0) {
      currencyData.isDefault = true;
    }
    
    const currency = new CurrencyConfig(currencyData);
    await currency.save();
    
    sendResponse(res, 201, 'Currency created successfully', currency);
  } catch (error) {
    console.error('Error creating currency:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, 'Validation error', null, validationErrors);
    }
    sendResponse(res, 500, 'Error creating currency', null, error.message);
  }
};

// Update currency
const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Check if currency code already exists (excluding current currency)
    if (updateData.code) {
      const existingCurrency = await CurrencyConfig.findOne({ 
        code: updateData.code.toUpperCase(),
        _id: { $ne: id }
      });
      
      if (existingCurrency) {
        return sendResponse(res, 400, 'Currency with this code already exists');
      }
    }
    
    const currency = await CurrencyConfig.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!currency) {
      return sendResponse(res, 404, 'Currency not found');
    }
    
    sendResponse(res, 200, 'Currency updated successfully', currency);
  } catch (error) {
    console.error('Error updating currency:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return sendResponse(res, 400, 'Validation error', null, validationErrors);
    }
    sendResponse(res, 500, 'Error updating currency', null, error.message);
  }
};

// Delete currency
const deleteCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    
    const currency = await CurrencyConfig.findById(id);
    if (!currency) {
      return sendResponse(res, 404, 'Currency not found');
    }
    
    // Don't allow deletion of default currency
    if (currency.isDefault) {
      return sendResponse(res, 400, 'Cannot delete default currency. Please set another currency as default first.');
    }
    
    await CurrencyConfig.findByIdAndDelete(id);
    
    sendResponse(res, 200, 'Currency deleted successfully');
  } catch (error) {
    console.error('Error deleting currency:', error);
    sendResponse(res, 500, 'Error deleting currency', null, error.message);
  }
};

// Set default currency
const setDefaultCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    
    const currency = await CurrencyConfig.findById(id);
    if (!currency) {
      return sendResponse(res, 404, 'Currency not found');
    }
    
    if (!currency.isActive) {
      return sendResponse(res, 400, 'Cannot set inactive currency as default');
    }
    
    // Update currency to be default (pre-save middleware will handle removing default from others)
    currency.isDefault = true;
    await currency.save();
    
    sendResponse(res, 200, 'Default currency updated successfully', currency);
  } catch (error) {
    console.error('Error setting default currency:', error);
    sendResponse(res, 500, 'Error setting default currency', null, error.message);
  }
};

// Toggle currency active status
const toggleCurrencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const currency = await CurrencyConfig.findById(id);
    if (!currency) {
      return sendResponse(res, 404, 'Currency not found');
    }
    
    // Don't allow deactivating default currency
    if (currency.isDefault && currency.isActive) {
      return sendResponse(res, 400, 'Cannot deactivate default currency. Please set another currency as default first.');
    }
    
    currency.isActive = !currency.isActive;
    await currency.save();
    
    sendResponse(res, 200, 'Currency status updated successfully', currency);
  } catch (error) {
    console.error('Error toggling currency status:', error);
    sendResponse(res, 500, 'Error toggling currency status', null, error.message);
  }
};

// Format amount with specific currency
const formatAmount = async (req, res) => {
  try {
    const { amount, currencyId } = req.body;
    
    if (!amount || amount < 0) {
      return sendResponse(res, 400, 'Valid amount is required');
    }
    
    let currency;
    if (currencyId) {
      currency = await CurrencyConfig.findById(currencyId);
    } else {
      currency = await CurrencyConfig.getDefault();
    }
    
    if (!currency) {
      return sendResponse(res, 404, 'Currency not found');
    }
    
    const formattedAmount = currency.formatAmount(amount);
    
    sendResponse(res, 200, 'Amount formatted successfully', {
      amount,
      formattedAmount,
      currency: {
        code: currency.code,
        symbol: currency.symbol,
        name: currency.name
      }
    });
  } catch (error) {
    console.error('Error formatting amount:', error);
    sendResponse(res, 500, 'Error formatting amount', null, error.message);
  }
};

// Seed default currencies
const seedDefaultCurrencies = async (req, res) => {
  try {
    const existingCount = await CurrencyConfig.countDocuments();
    
    if (existingCount > 0) {
      return sendResponse(res, 400, 'Currencies already exist. Cannot seed default data.');
    }
    
    const defaultCurrencies = [
      {
        name: 'US Dollar',
        code: 'USD',
        symbol: '$',
        position: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        isDefault: true,
        isActive: true,
        exchangeRate: 1,
        description: 'United States Dollar',
        country: 'United States',
        locale: 'en-US'
      },
      {
        name: 'Euro',
        code: 'EUR',
        symbol: '€',
        position: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        isDefault: false,
        isActive: true,
        exchangeRate: 0.85,
        description: 'European Euro',
        country: 'European Union',
        locale: 'de-DE'
      },
      {
        name: 'British Pound',
        code: 'GBP',
        symbol: '£',
        position: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        isDefault: false,
        isActive: true,
        exchangeRate: 0.73,
        description: 'British Pound Sterling',
        country: 'United Kingdom',
        locale: 'en-GB'
      },
      {
        name: 'Japanese Yen',
        code: 'JPY',
        symbol: '¥',
        position: 'before',
        decimals: 0,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        isDefault: false,
        isActive: true,
        exchangeRate: 110,
        description: 'Japanese Yen',
        country: 'Japan',
        locale: 'ja-JP'
      },
      {
        name: 'Bangladeshi Taka',
        code: 'BDT',
        symbol: '৳',
        position: 'before',
        decimals: 2,
        thousandsSeparator: ',',
        decimalSeparator: '.',
        isDefault: false,
        isActive: true,
        exchangeRate: 110,
        description: 'Bangladeshi Taka',
        country: 'Bangladesh',
        locale: 'bn-BD'
      }
    ];
    
    const currencies = await CurrencyConfig.insertMany(defaultCurrencies);
    
    sendResponse(res, 201, 'Default currencies seeded successfully', currencies);
  } catch (error) {
    console.error('Error seeding currencies:', error);
    sendResponse(res, 500, 'Error seeding currencies', null, error.message);
  }
};

module.exports = {
  getAllCurrencies,
  getDefaultCurrency,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  setDefaultCurrency,
  toggleCurrencyStatus,
  formatAmount,
  seedDefaultCurrencies
};