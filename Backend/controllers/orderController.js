import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";
import Order from "../models/orderModel.js";
import Product from "../models/modelOfProduct.js";
import User from "../models/userModel.js";

// Create Order
export const createOrder = handleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// Get all My orders
export const allMyOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return next(new HandleError("No Order Placed", 404));
  }
  res.status(200).json({
    success: true,
    orders,
  });
});

// Get All Orders
export const getAllOrders = handleAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return next(new HandleError("No Order Placed", 404));
  }
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});
export const updateOrderStatus = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleError("Order not found", 404));
  }

  if (order.orderStatus === "delivered") {
    return next(new HandleError("We have already delivered this order", 400));
  }

  const status = req.body.status.toLowerCase();

  // REDUCE STOCK ONLY WHEN SHIPPED
  if (status === "shipped" && order.orderStatus !== "shipped") {
    await Promise.all(
      order.orderItems.map((item) =>
        updateQuantity(item.product, item.quantity)
      )
    );
  }

  order.orderStatus = status;

  if (status === "delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});


async function updateQuantity(productId, quantity) {
  const product = await Product.findById(productId);

  if (!product) throw new Error("Product not found");

  if (product.stock < quantity) {
    throw new Error("Not enough stock");
  }

  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Order
export const deleteOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("Order not found", 404));
  }
  if (order.orderStatus !== "Delivered") {
    return next(
      new HandleError("This Order is under Process and can't be deleted", 400),
    );
  }
  await order.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
