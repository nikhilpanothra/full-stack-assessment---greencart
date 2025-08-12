import express from "express";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route("/:id")
  .put(protect, updateOrder)
  .delete(protect, deleteOrder);

export default router;
