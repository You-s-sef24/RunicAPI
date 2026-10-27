const { Router } = require("express");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const {
  ordersByStatus,
  topProducts,
  productsByCategory,
  priceDistribution,
} = require("../controllers/stats");

const router = Router();

router.use(verifyToken, checkAdmin);

router.get("/orders-by-status", ordersByStatus);
router.get("/top-products", topProducts);
router.get("/products-by-category", productsByCategory);
router.get("/price-distribution", priceDistribution);

module.exports = router;
