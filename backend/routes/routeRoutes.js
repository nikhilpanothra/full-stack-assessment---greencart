import express from "express";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "../controllers/routeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getRoutes)
  .post(protect, createRoute);

router.route("/:id")
  .put(protect, updateRoute)
  .delete(protect, deleteRoute);

export default router;
