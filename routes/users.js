const { Router } = require("express");
const {
  getAllUsers,
  login,
  register,
  logout,
  editProfile,
  getProfile,
} = require("../controllers/users");
const verifyToken = require("../middleware/verifyToken");
const validateRegister = require("../validators/valiateRegister");
const validateLogin = require("../validators/validateLogin");
const validateProfile = require("../validators/validateProfile");
const router = Router();

router.get("/", verifyToken, getAllUsers);
router.post("/login", validateLogin(), login);
router.post("/logout", verifyToken, logout);
router.post("/register", validateRegister(), register);
router.put("/me", verifyToken, validateProfile(), editProfile);
router.get("/:id", verifyToken, getProfile);
module.exports = router;
