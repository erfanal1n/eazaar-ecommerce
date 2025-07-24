const express = require('express');
const router = express.Router();
// internal
const productTypeController = require('../controller/product-type.controller');

// get single product type
router.get('/get/:id', productTypeController.getSingleProductType);
// add product type
router.post('/add', productTypeController.addProductType);
// add all product type
router.post('/add-all', productTypeController.addAllProductType);
// get all product type
router.get('/all', productTypeController.getAllProductType);
// get active product type
router.get('/active', productTypeController.getActiveProductType);
// get product type by slug
router.get('/slug/:slug', productTypeController.getProductTypeBySlug);
// delete product type
router.delete('/delete/:id', productTypeController.deleteProductType);
// update product type
router.patch('/edit/:id', productTypeController.updateProductType);
// toggle product type status
router.patch('/toggle-status/:id', productTypeController.toggleProductTypeStatus);
// get product type statistics
router.get('/stats', productTypeController.getProductTypeStats);

module.exports = router;