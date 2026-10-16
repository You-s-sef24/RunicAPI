const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
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
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);

module.exports = Category;
