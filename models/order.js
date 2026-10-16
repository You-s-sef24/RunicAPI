const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
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
        quantity: {
          type: Number,
          required: true,
          min: 1,
          validate: {
            validator: Number.isInteger,
            message: "Quantity must be an integer",
          },
        },
      },
    ],
    shippingAddress: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    government: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered"],
      default: "pending",
    },
    nails: {
      type: Number,
      required: true,
      min: 0,
    },
    nailsCost: {
      type: Number,
      required: true,
      min: 0,
    },
    subTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

const Order = model("Order", orderSchema);

module.exports = Order;
