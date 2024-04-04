import express from "express";
const router = express.Router();
import {
  authUser,
  userProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controller/userController.js";
import {
  protect,
  isAdmin,
  runValidation,
} from "../middleware/authMiddleware.js";
import {
  signinValidator,
  signupValidator,
  profileValidator,
} from "../validators/userValidators.js";

router.post("/", signupValidator, runValidation, registerUser);
router.post("/login", signinValidator, runValidation, authUser);
router.get("/profile", protect, userProfile);
router.put(
  "/profile",
  profileValidator,
  runValidation,
  protect,
  updateUserProfile
);
//admin routes
router.get("/", protect, isAdmin, getUsers);
router.delete("/:id", protect, isAdmin, deleteUser);
router.get("/:id", protect, isAdmin, getUserById);
router.put("/:id", protect, isAdmin, updateUser);

export default router;
