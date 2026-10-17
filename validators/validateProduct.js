const { body } = require("express-validator");

const validateProduct = () => {
  return [
    body("name.en")
      .trim()
      .notEmpty()
      .withMessage("English product name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("English product name must be between 2 and 100 characters"),

    body("name.ar")
      .trim()
      .notEmpty()
      .withMessage("Arabic product name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Arabic product name must be between 2 and 100 characters"),

    body("description.en")
      .trim()
      .notEmpty()
      .withMessage("English product description is required")
      .isLength({ min: 10, max: 1000 })
      .withMessage(
        "English product description must be between 10 and 1000 characters",
      ),

    body("description.ar")
      .trim()
      .notEmpty()
      .withMessage("Arabic product description is required")
      .isLength({ min: 10, max: 1000 })
      .withMessage(
        "Arabic product description must be between 10 and 1000 characters",
      ),

    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isFloat({ min: 0 })
      .withMessage("Price must be a non-negative number"),

    body("dimensions")
      .trim()
      .notEmpty()
      .withMessage("Product dimensions are required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Product dimensions must be between 1 and 100 characters"),

    body("categoryId")
      .notEmpty()
      .withMessage("Category ID is required")
      .isMongoId()
      .withMessage("Invalid category ID"),

    body("featured")
      .optional()
      .isBoolean({ strict: true })
      .withMessage("Featured must be a boolean value"),
  ];
};

module.exports = validateProduct;
