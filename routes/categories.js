const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const {
  validateCategory,
  validateCategoryUpdate,
} = require("../validators/validateCategory");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const upload = require("../middleware/upload");

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post(
  "/",
  verifyToken,
  checkAdmin,
  upload("category").single("image"),
  validateCategory(),
  addCategory,
);

router.patch(
  "/:id",
  verifyToken,
  checkAdmin,
  upload("category").single("image"),
  validateCategoryUpdate(),
  updateCategory,
);

router.delete("/:id", verifyToken, checkAdmin, deleteCategory);

module.exports = router;
