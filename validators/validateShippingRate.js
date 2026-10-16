const { body } = require("express-validator");

const validateShippingRate = () => [
  body("government")
    .trim()
    .notEmpty()
    .withMessage("Government is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Government must be between 2 and 100 characters")
    .customSanitizer((value) => value.toLowerCase()),

  body("name.en")
    .trim()
    .notEmpty()
    .withMessage("English name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("English name must be between 2 and 100 characters"),

  body("name.ar")
    .trim()
    .notEmpty()
    .withMessage("Arabic name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Arabic name must be between 2 and 100 characters"),

  body("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number")
    .toFloat(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false")
    .toBoolean(),
];

const validateShippingRateUpdate = () => [
  body("government")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Government cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Government must be between 2 and 100 characters")
    .customSanitizer((value) => value.toLowerCase()),

  body("name.en")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("English name cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("English name must be between 2 and 100 characters"),

  body("name.ar")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Arabic name cannot be empty")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Arabic name must be between 2 and 100 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number")
    .toFloat(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false")
    .toBoolean(),
];

module.exports = {
  validateShippingRate,
  validateShippingRateUpdate,
};
