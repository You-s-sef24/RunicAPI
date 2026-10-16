const { body } = require("express-validator");

const validateSetting = () => [
  body("nailCost")
    .exists()
    .withMessage("Nail cost is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Nail cost must be a non-negative number")
    .toFloat(),
];

module.exports = validateSetting;
