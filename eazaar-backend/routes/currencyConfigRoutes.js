const express = require('express');
const router = express.Router();
const {
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
} = require('../controller/currencyConfigController');

// Public routes (no authentication required)
router.get('/default', getDefaultCurrency);
router.get('/active', getAllCurrencies); // Will filter active currencies via query param
router.post('/format', formatAmount);

// Admin routes (authentication required - add middleware as needed)
router.get('/', getAllCurrencies);
router.get('/:id', getCurrencyById);
router.post('/', createCurrency);
router.put('/:id', updateCurrency);
router.delete('/:id', deleteCurrency);
router.patch('/:id/set-default', setDefaultCurrency);
router.patch('/:id/toggle-status', toggleCurrencyStatus);
router.post('/seed-defaults', seedDefaultCurrencies);

module.exports = router;