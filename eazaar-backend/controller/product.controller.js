const Brand = require("../model/Brand");
const productServices = require("../services/product.service");
const Product = require("../model/Products");


// add product
exports.addProduct = async (req, res,next) => {
  console.log('product--->',req.body);
  try {
    const firstItem = {
      color: {
        name:'',
        clrCode:''
      },
      img: req.body.img,
    };
    const imageURLs = [firstItem, ...(req.body.imageURLs || [])];
    const result = await productServices.createProductService({
      ...req.body,
      imageURLs: imageURLs,
    });

    console.log('product-result',result)
 
    res.status(200).json({
      success:true,
      status: "success",
      message: "Product created successfully!",
      data: result,
    });
  } catch (error) {
    console.log('Product creation error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        status: "fail",
        message: "Validation failed",
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error)
  }
};


// add all product
module.exports.addAllProducts = async (req,res,next) => {
  try {
    const result = await productServices.addAllProductService(req.body);
    res.json({
      message:'Products added successfully',
      result,
    })
  } catch (error) {
    next(error)
  }
}

// get all products
exports.getAllProducts = async (req,res,next) => {
  try {
    const result = await productServices.getAllProductsService();
    res.status(200).json({
      success:true,
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get all products by type
module.exports.getProductsByType = async (req,res,next) => {
  try {
    const result = await productServices.getProductTypeService(req);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// get offer product controller
module.exports.getOfferTimerProducts = async (req,res,next) => {
  try {
    const result = await productServices.getOfferTimerProductService(req.query.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get Popular Product By Type
module.exports.getPopularProductByType = async (req,res,next) => {
  try {
    const result = await productServices.getPopularProductServiceByType(req.params.type);
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// get top rated Products
module.exports.getTopRatedProducts = async (req,res,next) => {
  try {
    const result = await productServices.getTopRatedProductService();
    res.status(200).json({
      success:true, 
      data:result,
    })
  } catch (error) {
    next(error)
  }
}

// getSingleProduct
exports.getSingleProduct = async (req,res,next) => {
  try {
    const product = await productServices.getProductService(req.params.id)
    res.json(product)
  } catch (error) {
    next(error)
  }
}

// get Related Product
exports.getRelatedProducts = async (req,res,next) => {
  try {
    const products = await productServices.getRelatedProductService(req.params.id)
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
}

// update product
exports.updateProduct = async (req, res,next) => {
  try {
    const product = await productServices.updateProductService(req.params.id,req.body)
    res.send({ data: product, message: "Product updated successfully!" });
  } catch (error) {
    next(error)
  }
};

// update product
exports.reviewProducts = async (req, res,next) => {
  try {
    const products = await productServices.getReviewsProducts()
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
};

// update product
exports.stockOutProducts = async (req, res,next) => {
  try {
    const products = await productServices.getStockOutProducts();
    res.status(200).json({
      success:true, 
      data:products,
    })
  } catch (error) {
    next(error)
  }
};

// adjust inventory manually (for admin restocking)
exports.adjustInventory = async (req, res, next) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'set'
    const productId = req.params.id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let updateQuery;
    if (operation === 'add') {
      // Add to existing quantity (restocking)
      updateQuery = { 
        $inc: { quantity: quantity },
        $set: { status: 'in-stock' } // Set back to in-stock when restocking
      };
    } else {
      // Set absolute quantity
      updateQuery = { 
        $set: { 
          quantity: quantity,
          status: quantity > 0 ? 'in-stock' : 'out-of-stock'
        }
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateQuery,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Inventory adjusted successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    next(error);
  }
};

// delete product
exports.deleteProduct = async (req, res,next) => {
  try {
    await productServices.deleteProduct(req.params.id);
    res.status(200).json({
      message:'Product delete successfully'
    })
  } catch (error) {
    next(error)
  }
};

