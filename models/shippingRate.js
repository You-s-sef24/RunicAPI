const { Schema, model } = require("mongoose");

const shippingRateSchema = new Schema(
  {
    government: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const ShippingRate = model("ShippingRate", shippingRateSchema);

module.exports = ShippingRate;
