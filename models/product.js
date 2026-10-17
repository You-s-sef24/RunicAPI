const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      en: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },
    },
    description: {
      en: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000,
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    dimensions: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: ["uploads/product.jpg"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Product = model("Product", productSchema);

module.exports = Product;
