const { body } = require("express-validator");

const validateRegister = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 25 })
      .withMessage("Name must be between 2-25 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("phone")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 10, max: 15 })
      .withMessage("Phone number must be between 10-15 characters"),
  ];
};

module.exports = validateRegister;
