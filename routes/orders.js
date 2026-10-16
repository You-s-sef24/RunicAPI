const { Router } = require("express");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const {
  getOrders,
  getOrderById,
  addOrder,
  updateOrderStatus,
  getOrdersByUserId,
} = require("../controllers/orders");
const validateOrder = require("../middleware/validateOrder");
const router = Router();

router.get("/", verifyToken, checkAdmin, getOrders);
router.get("/:id", verifyToken, getOrderById);
router.post("/", verifyToken, validateOrder(), addOrder);
router.put("/:id", verifyToken, checkAdmin, updateOrderStatus);
router.get("/user/:userId", verifyToken, getOrdersByUserId);

module.exports = router;
