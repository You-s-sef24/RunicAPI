const express = require("express");
const router = express.Router();

const {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  validateCategory,
  validateCategoryUpdate,
} = require("../validators/validateCategory");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post("/", verifyToken, checkAdmin, validateCategory(), addCategory);

router.patch(
  "/:id",
  verifyToken,
  checkAdmin,
  validateCategoryUpdate(),
  updateCategory,
);

router.delete("/:id", verifyToken, checkAdmin, deleteCategory);

module.exports = router;
