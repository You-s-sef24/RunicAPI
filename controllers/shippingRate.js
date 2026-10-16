const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const ShippingRate = require("../models/shippingRate");

const getShippingRates = async (req, res, next) => {
  try {
    const shippingRates = await ShippingRate.find().sort({ government: 1 });

    return res.status(200).json({
      message: shippingRates.length
        ? "Shipping rates retrieved successfully"
        : "No shipping rates found",
      shippingRates,
    });
  } catch (err) {
    next(err);
  }
};

const addShippingRate = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({ errors: results.array() });
    }

    const { government, name, price, isActive = true } = req.body;
    const normalizedGovernment = government.trim().toLowerCase();

    const existingRate = await ShippingRate.findOne({
      government: normalizedGovernment,
    });

    if (existingRate) {
      return res.status(409).json({
        message: "A shipping rate already exists for this government",
      });
    }

    const shippingRate = await ShippingRate.create({
      government: normalizedGovernment,
      name,
      price,
      isActive,
    });

    return res.status(201).json({
      message: "Shipping rate created successfully",
      shippingRate,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "A shipping rate already exists for this government",
      });
    }

    next(err);
  }
};

const updateShippingRate = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({ errors: results.array() });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid shipping rate ID" });
    }

    const { government, name, price, isActive } = req.body;
    const updates = {};

    if (government !== undefined) {
      updates.government = government.trim().toLowerCase();
    }

    if (name !== undefined) updates.name = name;
    if (price !== undefined) updates.price = price;
    if (isActive !== undefined) updates.isActive = isActive;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    if (updates.government !== undefined) {
      const existingRate = await ShippingRate.findOne({
        government: updates.government,
        _id: { $ne: id },
      });

      if (existingRate) {
        return res.status(409).json({
          message: "A shipping rate already exists for this government",
        });
      }
    }

    const shippingRate = await ShippingRate.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!shippingRate) {
      return res.status(404).json({ message: "Shipping rate not found" });
    }

    return res.status(200).json({
      message: "Shipping rate updated successfully",
      shippingRate,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "A shipping rate already exists for this government",
      });
    }

    next(err);
  }
};

const deleteShippingRate = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid shipping rate ID" });
    }

    const shippingRate = await ShippingRate.findByIdAndDelete(id);

    if (!shippingRate) {
      return res.status(404).json({ message: "Shipping rate not found" });
    }

    return res.status(200).json({
      message: "Shipping rate deleted successfully",
      shippingRate,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShippingRates,
  addShippingRate,
  updateShippingRate,
  deleteShippingRate,
};
