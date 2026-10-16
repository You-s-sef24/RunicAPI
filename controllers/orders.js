const { default: mongoose } = require("mongoose");
const Order = require("../models/order");
const { validationResult } = require("express-validator");
const Settings = require("../models/settings");
const ShippingRate = require("../models/shippingRate");
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
    const { items, shippingAddress, nails, government } = req.body;

    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({
        errors: results.array(),
      });
    }

    const normalizedGovernment = government.trim().toLowerCase();

    const shippingRate = await ShippingRate.findOne({
      government: normalizedGovernment,
      isActive: true,
    });

    if (!shippingRate) {
      return res.status(400).json({
        message: "Invalid or unavailable government",
      });
    }

    const { orderItems, subtotal } = await calculateSubtotal(items);

    let nailsCost = 0;

    if (nails > 0) {
      const nailSetting = await Settings.findOne({
        key: "nailCost",
      });

      const pricePerNail = nailSetting?.values?.price;

      if (
        typeof pricePerNail !== "number" ||
        !Number.isFinite(pricePerNail) ||
        pricePerNail < 0
      ) {
        return res.status(500).json({
          message: "Nail pricing is not configured correctly",
        });
      }

      nailsCost = pricePerNail * nails;
    }

    const order = await Order.create({
      userId: req.userId,
      items: orderItems,
      shippingAddress,
      government: shippingRate.government,
      status: "pending",
      nails,
      nailsCost,
      shippingCost: shippingRate.price,
      subTotal: subtotal,
      total: subtotal + nailsCost + shippingRate.price,
    });

    return res.status(201).json({
      message: "Order added successfully",
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
