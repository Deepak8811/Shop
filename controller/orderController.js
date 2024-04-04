import asynchandler from "express-async-handler";
import Order from "../models/orderModel.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// @desc    Create new Order
// @router POST /api/orders
// @access private
export const addOrderItems = asynchandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Item");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    get order by id
// @router GET /api/orders/:id
// @access private
export const getOrderById = asynchandler(async (req, res) => {
  const order = await Order.findById({ _id: req.params.id }).populate(
    "user",
    "name email"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    update order to paid
// @router POST /api/orders/:id/paid
// @access private
export const updateOrderToPaid = asynchandler(async (req, res) => {
  const order = await Order.findById({ _id: req.params.id });
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    ger stripe client_secret
// @router POST /api/orders/stripe/process
// @access private
export const createStripe = asynchandler(async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "INR",
    description: "Software development services",
    metadata: { integration_check: "accept_a_payment" },
  });
  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

// @desc    update order to paid
// @router POST /api/orders/:id/paid
// @access private
export const updateOrderToPaidByStripe = asynchandler(async (req, res) => {
  const order = await Order.findById({ _id: req.params.id });
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.stripePaymentResult = {
      id: req.body.paymentId,
      status: req.body.status,
    };
    order.paymentMethod = "stripe";
    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    get logged in user orders
// @router GET /api/orders/useroders
// @access private
export const getMyOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    get all orders
// @router GET /api/orders/
// @access private/admin
export const getOrders = asynchandler(async (req, res) => {
  const orders = await Order.find({});
  res.json(orders);
});

// @desc    update order to delivered
// @router POST /api/orders/:id/delivered
// @access private/admin
export const updateOrderToDelivered = asynchandler(async (req, res) => {
  const order = await Order.findById({ _id: req.params.id });
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updateOrder = await order.save();
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
