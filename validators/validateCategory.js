const { body } = require("express-validator");

const validateCategory = () => [
  body("name.en")
    .trim()
    .notEmpty()
    .withMessage("English category name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("English name must be between 2 and 100 characters"),

  body("name.ar")
    .trim()
    .notEmpty()
    .withMessage("Arabic category name is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Arabic name must be between 2 and 100 characters"),

  body("description.en")
    .trim()
    .notEmpty()
    .withMessage("English description is required")
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage("English description must be between 10 and 1000 characters"),

  body("description.ar")
    .trim()
    .notEmpty()
    .withMessage("Arabic description is required")
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Arabic description must be between 10 and 1000 characters"),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Category image is required"),
];

const validateCategoryUpdate = () => [
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

  body("description.en")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("English description cannot be empty")
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage("English description must be between 10 and 1000 characters"),

  body("description.ar")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Arabic description cannot be empty")
    .bail()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Arabic description must be between 10 and 1000 characters"),

  body("image")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Image cannot be empty"),
];

module.exports = {
  validateCategory,
  validateCategoryUpdate,
};
