const express = require("express");
const {
  register,
  login,
  updateUser,
  getUser,
  deleteUser,
  getUserById,
  getAllUsers,
} = require("../controllers/users");
const { validation } = require("../middleware/validation");
const { loginSchema } = require("../validation/login.validation");
const { registerSchema } = require("../validation/register.validation");
const { auth, restrictTo } = require("../middleware/auth");
const router = express.Router();

router.post("/register", validation(registerSchema), register);
router.post("/login", validation(loginSchema), login);
router.get("/me", auth, getUser); // Get user details
router.patch("/update", auth, restrictTo("admin"), updateUser); // Update user details
router.delete("/delete/:id", auth, restrictTo("admin"), deleteUser); // Delete user
router.get("/getuser/:id", auth, restrictTo("admin"), getUserById); // Get user by ID
router.get("/getallusers", auth, restrictTo("admin"), getAllUsers); // Get all users
module.exports = router;
