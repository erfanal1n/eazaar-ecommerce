const productTypeServices = require("../services/product-type.service");

// add product type
exports.addProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.createProductTypeService(req.body);
    res.status(200).json({
      status: "success",
      message: "Product Type created successfully!",
      data: result,
    });
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// add all product type
exports.addAllProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.addAllProductTypeService(req.body);
    res.json({
      message: 'Product Type added successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get active product type
exports.getActiveProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.getActiveProductTypeServices();
    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get all product type
exports.getAllProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.getAllProductTypeServices();
    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get product type by slug
exports.getProductTypeBySlug = async (req, res, next) => {
  try {
    const result = await productTypeServices.getProductTypeBySlugService(req.params.slug);
    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}

// delete product type
exports.deleteProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.deleteProductTypeService(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Product Type deleted successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// update product type
exports.updateProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.updateProductTypeService(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Product Type updated successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get single product type
exports.getSingleProductType = async (req, res, next) => {
  try {
    const result = await productTypeServices.getSingleProductTypeService(req.params.id);
    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}

// toggle product type status
exports.toggleProductTypeStatus = async (req, res, next) => {
  try {
    const result = await productTypeServices.toggleProductTypeStatusService(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Product Type status updated successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get product type statistics
exports.getProductTypeStats = async (req, res, next) => {
  try {
    const result = await productTypeServices.getProductTypeStatsService();
    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    next(error)
  }
}