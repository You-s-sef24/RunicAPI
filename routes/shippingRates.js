const express = require("express");
const router = express.Router();

const {
  getShippingRates,
  addShippingRate,
  updateShippingRate,
  deleteShippingRate,
} = require("../controllers/shippingRate");

const {
  validateShippingRate,
  validateShippingRateUpdate,
} = require("../validators/validateShippingRate");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");

router.use(verifyToken, checkAdmin);

router.get("/", getShippingRates);
router.post("/", validateShippingRate(), addShippingRate);
router.patch("/:id", validateShippingRateUpdate(), updateShippingRate);
router.delete("/:id", deleteShippingRate);

module.exports = router;
