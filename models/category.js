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
  },
  { timestamps: true },
);

const Category = model("Category", categorySchema);

module.exports = Category;
