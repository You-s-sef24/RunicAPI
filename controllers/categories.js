const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Category = require("../models/category");
const deleteImages = require("../utils/deleteImages");
const { getPagination, paginationMeta } = require("../utils/pagination");

const getCategories = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);

    const [categories, total] = await Promise.all([
      Category.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Category.countDocuments(),
    ]);

    return res.status(200).json({
      message: categories.length
        ? "Categories retrieved successfully"
        : "No categories found",
      categories,
      ...paginationMeta(page, limit, total),
    });
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({ errors: results.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { name, description } = req.body;
    const image = `category/${req?.file?.filename}`;

    const category = await Category.create({
      name,
      description,
      image,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const results = validationResult(req);

    if (!results.isEmpty()) {
      return res.status(400).json({
        errors: results.array(),
      });
    }

    const { name, description } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const oldImage = category.image;
    const newImage = req.file ? `category/${req.file.filename}` : undefined;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (newImage !== undefined) updates.image = newImage;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No fields provided to update",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (newImage && oldImage && oldImage !== newImage) {
      try {
        await deleteImages([oldImage]);
      } catch (err) {
        console.error("Failed to delete old category image:", err);
      }
    }

    return res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const image = category.image;

    await Category.findByIdAndDelete(id);

    if (image) {
      try {
        await deleteImages([image]);
      } catch (err) {
        console.error("Failed to delete category image:", err);
      }
    }

    return res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
};
