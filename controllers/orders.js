const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
const { validationResult } = require("express-validator");
const ShippingRate = require("../models/shippingRate");
const Setting = require("../models/settings");
const calculateSubtotal = require("../utils/calculateSubtotal");

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders found", orders });
    }
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.userId._id.toString() !== req.userId.toString() && !req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({ message: "Order retrieved successfully", order });
  } catch (err) {
    next(err);
  }
};

const getOrdersByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (mongoose.Types.ObjectId.isValid(userId) === false) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    if (userId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ userId }).populate(
      "userId",
      "name email",
    );
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (err) {
    next(err);
  }
};

const addOrder = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({
        errors: results.array(),
      });
    }

    const { items, shippingAddress, government, nails = 0 } = req.body;

    const normalizedGovernment = government.trim().toLowerCase();

    const shippingRate = await ShippingRate.findOne({
      government: normalizedGovernment,
      isActive: true,
    });

    if (!shippingRate) {
      return res.status(400).json({
        message: "Shipping is not available for this government",
      });
    }

    const { orderItems, subtotal } = await calculateSubtotal(items);

    let nailsCost = 0;

    if (nails > 0) {
      const setting = await Setting.findOne();
      const pricePerNail = setting?.nailCost;

      if (
        typeof pricePerNail !== "number" ||
        !Number.isFinite(pricePerNail) ||
        pricePerNail < 0
      ) {
        return res.status(500).json({
          message: "Nail cost is not configured correctly",
        });
      }

      nailsCost = nails * pricePerNail;
    }

    const shippingCost = shippingRate.price;
    const total = subtotal + nailsCost + shippingCost;

    const order = await Order.create({
      userId: req.userId,
      items: orderItems,
      shippingAddress,
      government: shippingRate.government,
      status: "pending",
      nails,
      nailsCost,
      subTotal: subtotal,
      shippingCost,
      total,
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (mongoose.Types.ObjectId.isValid(id) === false) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    if (!["pending", "delivered"].includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserId,
};
