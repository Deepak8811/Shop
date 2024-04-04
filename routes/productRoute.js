import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProductById,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from "../controller/productController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

router.get("/top", getTopProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/:id/review", protect, createProductReview);

router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProductById);

export default router;
