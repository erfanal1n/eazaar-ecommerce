const Brand = require("../model/Brand");
const Category = require("../model/Category");
const Product = require("../model/Products");

// create product service
exports.createProductService = async (data) => {
  const product = await Product.create(data);
  const { _id: productId, brand, category } = product;
  //update Brand
  await Brand.updateOne(
    { _id: brand.id },
    { $push: { products: productId } }
  );
  //Category Brand
  await Category.updateOne(
    { _id: category.id },
    { $push: { products: productId } }
  );
  return product;
};

// create all product service
exports.addAllProductService = async (data) => {
  await Product.deleteMany();
  const products = await Product.insertMany(data);
  for (const product of products) {
    await Brand.findByIdAndUpdate(product.brand.id, {
      $push: { products: product._id },
    });
    await Category.findByIdAndUpdate(product.category.id, {
      $push: { products: product._id },
    });
  }
  return products;
};

// get product data
exports.getAllProductsService = async () => {
  const products = await Product.find({}).populate("reviews");
  return products;
};

// get type of product service
exports.getProductTypeService = async (req) => {
  const type = req.params.type;
  const query = req.query;
  let products;
  if (query.new === "true") {
    products = await Product.find({ productType: type })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("reviews");
  } else if (query.featured === "true") {
    products = await Product.find({
      productType: type,
      featured: true,
    }).populate("reviews");
  } else if (query.topSellers === "true") {
    products = await Product.find({ productType: type })
      .sort({ sellCount: -1 })
      .limit(8)
      .populate("reviews");
  } else {
    products = await Product.find({ productType: type }).populate("reviews");
  }
  return products;
};

// get offer product service
exports.getOfferTimerProductService = async (query) => {
  const products = await Product.find({
    productType: query,
    "offerDate.endDate": { $gt: new Date() },
  }).populate("reviews");
  return products;
};

// get popular product service by type
exports.getPopularProductServiceByType = async (type) => {
  const products = await Product.find({ productType: type })
    .sort({ "reviews.length": -1 })
    .limit(8)
    .populate("reviews");
  return products;
};

exports.getTopRatedProductService = async () => {
  const products = await Product.find({
    reviews: { $exists: true, $ne: [] },
  }).populate("reviews");

  const topRatedProducts = products.map((product) => {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRating / product.reviews.length;

    return {
      ...product.toObject(),
      rating: averageRating,
    };
  });

  topRatedProducts.sort((a, b) => b.rating - a.rating);

  return topRatedProducts;
};

// get product data
exports.getProductService = async (id) => {
  const product = await Product.findById(id).populate({
    path: "reviews",
    populate: { path: "userId", select: "name email imageURL" },
  });
  return product;
};

// get product data
exports.getRelatedProductService = async (productId) => {
  const currentProduct = await Product.findById(productId);

  const relatedProducts = await Product.find({
    "category.name": currentProduct.category.name,
    _id: { $ne: productId }, // Exclude the current product ID
  });
  return relatedProducts;
};

// update a product
exports.updateProductService = async (id, currProduct) => {
  console.log('Updating product with ID:', id);
  console.log('Update data:', currProduct);
  
  try {
    // Use findByIdAndUpdate for atomic updates
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: {
          title: currProduct.title,
          'brand.name': currProduct.brand.name,
          'brand.id': currProduct.brand.id,
          'category.name': currProduct.category.name,
          'category.id': currProduct.category.id,
          sku: currProduct.sku,
          img: currProduct.img,
          slug: currProduct.slug,
          unit: currProduct.unit,
          imageURLs: currProduct.imageURLs,
          tags: currProduct.tags,
          parent: currProduct.parent,
          children: currProduct.children,
          price: currProduct.price,
          discount: currProduct.discount,
          quantity: currProduct.quantity,
          status: currProduct.status,
          productType: currProduct.productType,
          description: currProduct.description,
          additionalInformation: currProduct.additionalInformation,
          'offerDate.startDate': currProduct.offerDate.startDate,
          'offerDate.endDate': currProduct.offerDate.endDate,
          videoId: currProduct.videoId
        }
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run schema validators
      }
    );

    if (!updatedProduct) {
      throw new Error('Product not found');
    }

    console.log('Product updated successfully:', updatedProduct._id);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// update product inventory (reduce quantity when order is completed)
exports.updateProductInventory = async (productId, quantityToReduce) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.quantity < quantityToReduce) {
      throw new Error(`Insufficient inventory. Available: ${product.quantity}, Requested: ${quantityToReduce}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: { quantity: -quantityToReduce, sellCount: quantityToReduce },
        $set: { 
          status: product.quantity - quantityToReduce <= 0 ? 'out-of-stock' : product.status 
        }
      },
      { new: true, runValidators: true }
    );

    console.log(`Inventory updated for product ${productId}: reduced by ${quantityToReduce}, new quantity: ${updatedProduct.quantity}`);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product inventory:', error);
    throw error;
  }
};



// get Reviews Products
exports.getReviewsProducts = async () => {
  const result = await Product.find({
    reviews: { $exists: true, $ne: [] },
  })
    .populate({
      path: "reviews",
      populate: { path: "userId", select: "name email imageURL" },
    });

  const products = result.filter(p => p.reviews.length > 0)

  return products;
};

// get Reviews Products
exports.getStockOutProducts = async () => {
  const result = await Product.find({ status: "out-of-stock" }).sort({ createdAt: -1 })
  return result;
};

// get Reviews Products
exports.deleteProduct = async (id) => {
  const result = await Product.findByIdAndDelete(id)
  return result;
};