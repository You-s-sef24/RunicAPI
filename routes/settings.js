const { Router } = require("express");

const verifyToken = require("../middleware/verifyToken");
const checkAdmin = require("../middleware/checkAdmin");
const { getNailCost, updateNailCost } = require("../controllers/settings");
const validateSetting = require("../middleware/validateSettings");

const router = Router();

router.get("/nail-cost", checkAdmin, getNailCost);
router.patch(
  "/nail-cost",
  verifyToken,
  checkAdmin,
  validateSetting(),
  updateNailCost,
);

module.exports = router;
