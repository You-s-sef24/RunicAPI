const express = require("express");
const multer = require("multer");
const router = express.Router();

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const fileName = `img-${Date.now()}.${ext}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const type = file.mimetype.split("/")[0];
  if (type === "image") {
    cb(null, true);
  } else {
    cb(new Error("File must be an image"), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

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

router.get("/", getCategories);
router.get("/:id", getCategoryById);

router.post(
  "/",
  verifyToken,
  checkAdmin,
  upload.single("image"),
  validateCategory(),
  addCategory,
);

router.patch(
  "/:id",
  verifyToken,
  checkAdmin,
  upload.single("image"),
  validateCategoryUpdate(),
  updateCategory,
);

router.delete("/:id", verifyToken, checkAdmin, deleteCategory);

module.exports = router;
