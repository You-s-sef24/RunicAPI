const { body } = require("express-validator");

const validateOrder = () => [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required for each item")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("shippingAddress")
    .trim()
    .notEmpty()
    .withMessage("Shipping address is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Shipping address must be between 5 and 100 characters"),

  body("government").trim().notEmpty().withMessage("Government is required"),

  body("nails")
    .isInt({ min: 0 })
    .withMessage("Nails must be a non-negative integer"),
];

module.exports = validateOrder;
