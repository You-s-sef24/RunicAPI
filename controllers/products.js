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

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const products = await Product.find({ categoryId }, { __v: 0 })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: products.length
        ? "Products retrieved successfully"
        : "No products found in this category",
      category,
      products,
    });
  } catch (err) {
    next(err);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }, { __v: 0 })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: products.length
        ? "Featured products retrieved successfully"
        : "No featured products found",
      products,
    });
  } catch (err) {
    next(err);
  }
};

const getBestsellers = async (req, res, next) => {
  try {
    const bestsellers = await Order.aggregate([
      {
        $match: {
          status: "delivered",
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },

      {
        $sort: {
          totalSold: -1,
        },
      },

      {
        $lookup: {
          from: Product.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      {
        $lookup: {
          from: Category.collection.name,
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          description: "$product.description",
          price: "$product.price",
          dimensions: "$product.dimensions",
          images: "$product.images",
          featured: "$product.featured",
          categoryId: {
            _id: "$category._id",
            name: "$category.name",
          },
          totalSold: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: bestsellers.length
        ? "Bestsellers retrieved successfully"
        : "No bestsellers found",
      products: bestsellers,
    });
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
  getProductsByCategory,
  getFeaturedProducts,
  getBestsellers,
};
