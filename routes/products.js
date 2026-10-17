const { Router } = require("express");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getBestsellers,
} = require("../controllers/products");
const validateProduct = require("../validators/validateProduct");
const router = Router();
const upload = require("../middleware/upload");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/featured", getFeaturedProducts);
router.get("/bestsellers", getBestsellers);

router.post(
  "/",
  verifyToken,
  checkAdmin,
  upload("product").array("images", 5),
  validateProduct(),
  createProduct,
);
router.put(
  "/:id",
  verifyToken,
  checkAdmin,
  upload("product").array("images", 5),
  validateProduct(),
  updateProduct,
);
router.delete("/:id", verifyToken, checkAdmin, deleteProduct);

module.exports = router;
