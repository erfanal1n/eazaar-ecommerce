const ApiError = require('../errors/api-error');
const ProductType = require('../model/ProductType');
const Category = require('../model/Category');
const Products = require('../model/Products');

// create product type service
exports.createProductTypeService = async (data) => {
  const productType = await ProductType.create(data);
  return productType;
}

// create all product type service
exports.addAllProductTypeService = async (data) => {
  await ProductType.deleteMany()
  const productType = await ProductType.insertMany(data);
  return productType;
}

// get all active product type service
exports.getActiveProductTypeServices = async () => {
  const productType = await ProductType.find({status:'active'}).populate('categories').populate('products');
  return productType;
}

// get all product type 
exports.getAllProductTypeServices = async () => {
  const productType = await ProductType.find({})
  return productType;
}

// get product type by slug service
exports.getProductTypeBySlugService = async (slug) => {
  const productType = await ProductType.findOne({slug: slug}).populate('categories').populate('products');
  return productType;
}

// delete product type service
exports.deleteProductTypeService = async (id) => {
  const result = await ProductType.findByIdAndDelete(id);
  return result;
}

// update product type
exports.updateProductTypeService = async (id, payload) => {
  const isExist = await ProductType.findOne({ _id: id })

  if (!isExist) {
    throw new ApiError(404, 'Product Type not found !')
  }

  const result = await ProductType.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
  return result
}

// get single product type
exports.getSingleProductTypeService = async (id) => {
  const result = await ProductType.findById(id);
  return result;
}

// toggle product type status
exports.toggleProductTypeStatusService = async (id) => {
  const productType = await ProductType.findById(id);
  
  if (!productType) {
    throw new ApiError(404, 'Product Type not found!');
  }

  const newStatus = productType.status === 'active' ? 'inactive' : 'active';
  const result = await ProductType.findByIdAndUpdate(id, { status: newStatus }, { new: true });
  return result;
}

// get product type statistics
exports.getProductTypeStatsService = async () => {
  const stats = await ProductType.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  return stats;
}