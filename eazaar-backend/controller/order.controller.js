const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");

// create-payment-intent
exports.paymentIntent = async (req, res, next) => {
  try {
    const product = req.body;
    const price = Number(product.price);
    const amount = price * 100;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount,
      payment_method_types: ["card"],
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    next(error)
  }
};
// addOrder
exports.addOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    
    // Create the order first
    const orderItems = await Order.create(orderData);

    // If payment method is Card (immediate payment), update inventory immediately
    if (orderData.paymentMethod === "Card") {
      await updateInventoryForOrder(orderItems.cart);
    }

    res.status(200).json({
      success: true,
      message: "Order added successfully",
      order: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

// Helper function to update inventory for order items
const updateInventoryForOrder = async (cartItems) => {
  const productServices = require("../services/product.service");
  
  for (const item of cartItems) {
    try {
      await productServices.updateProductInventory(item._id, item.orderQuantity);
    } catch (error) {
      console.error(`Failed to update inventory for product ${item._id}:`, error.message);
      // Continue with other items even if one fails
    }
  }
};
// get Orders
exports.getOrders = async (req, res, next) => {
  try {
    const orderItems = await Order.find({}).populate('user');
    res.status(200).json({
      success: true,
      data: orderItems,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
// get Orders
exports.getSingleOrder = async (req, res, next) => {
  try {
    const orderItem = await Order.findById(req.params.id).populate('user');
    res.status(200).json(orderItem);
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const newStatus = req.body.status;
  try {
    // Get the order first to check current status and payment method
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: newStatus,
        },
      }, 
      { new: true }
    );

    // If order is being marked as delivered and it's COD, update inventory
    if (newStatus === 'delivered' && order.paymentMethod === 'COD' && order.status !== 'delivered') {
      console.log('Updating inventory for COD order marked as delivered');
      await updateInventoryForOrder(order.cart);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      order: updatedOrder,
    });
  }
  catch (error) {
    console.log(error);
    next(error)
  }
};
