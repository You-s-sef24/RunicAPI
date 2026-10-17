const { default: mongoose } = require("mongoose");
const Product = require("../models/product");
const Category = require("../models/category");
const { validationResult } = require("express-validator");
const deleteImages = require("../utils/deleteImages");
const MAX_IMAGES = 5;

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
    const files = req?.files || [];
    if (files.length === 0) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { name, description, price, dimensions, categoryId, featured } =
      req.body;
    const images = files.map((image) => {
      return `product/${image?.filename}`;
    });

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
    const { name, description, price, dimensions, categoryId, featured } =
      req.body;

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

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (categoryId) {
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    let kept = req.body.existingImages ?? [];

    if (!Array.isArray(kept)) {
      kept = [kept];
    }

    kept = kept.filter((img) => product.images.includes(img));

    const newImages = (req.files || []).map(
      (file) => `product/${file.filename}`,
    );

    const finalImages = [...kept, ...newImages];

    if (finalImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    if (finalImages.length > MAX_IMAGES) {
      return res
        .status(400)
        .json({ message: `You can't have more than ${MAX_IMAGES} images` });
    }

    const updateds = { images: finalImages };
    if (name !== undefined) updateds.name = name;
    if (description !== undefined) updateds.description = description;
    if (price !== undefined) updateds.price = price;
    if (categoryId !== undefined) updateds.categoryId = categoryId;
    if (dimensions !== undefined) updateds.dimensions = dimensions;
    if (featured !== undefined) updateds.featured = featured;

    const removedImages = product.images.filter(
      (img) => !finalImages.includes(img),
    );

    const updatedProduct = await Product.findByIdAndUpdate(id, updateds, {
      new: true,
      runValidators: true,
    }).populate("categoryId", "name");

    try {
      await deleteImages(removedImages);
    } catch (err) {
      console.error("Failed to delete old product images:", err);
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

    try {
      await deleteImages(deletedProduct.images);
    } catch (err) {
      console.error("Failed to delete product images:", err);
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
