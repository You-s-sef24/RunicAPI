const { body } = require("express-validator");

const validateProfile = () => {
  return [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty")
      .isLength({ min: 2, max: 25 })
      .withMessage("Name must be between 2-25 characters"),
  ];
};

module.exports = validateProfile;
