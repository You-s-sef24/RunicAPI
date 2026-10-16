const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const { validationResult } = require("express-validator");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}, { __v: 0 }).populate(
      "categoryId",
      "name",
    );
    if (products.length === 0) {
      return res.status(200).json({ message: "No products found", products });
    }
    res
      .status(200)
      .json({ message: "Products retrieved successfully", products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id, { __v: 0 }).populate(
      "categoryId",
      "name",
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product retrieved successfully", product });
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      dimensions,
      categoryId,
      images,
      featured,
    } = req.body;

    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: results.array(),
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      dimensions,
      categoryId,
      images,
      featured,
    });

    const savedProduct = await newProduct.save();
    await savedProduct.populate("categoryId", "name");

    res
      .status(201)
      .json({ message: "Product created successfully", product: savedProduct });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      dimensions,
      categoryId,
      images,
      featured,
    } = req.body;

    const updateds = {};
    if (name !== undefined) updateds.name = name;
    if (description !== undefined) updateds.description = description;
    if (price !== undefined) updateds.price = price;
    if (categoryId !== undefined) updateds.categoryId = categoryId;
    if (dimensions !== undefined) updateds.dimensions = dimensions;
    if (images !== undefined) updateds.images = images;
    if (featured !== undefined) updateds.featured = featured;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: results.array(),
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const existingCategory = await Category.findById(categoryId);

    if (categoryId && !existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateds, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name");

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
