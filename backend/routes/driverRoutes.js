import express from "express";
import { getDrivers, createDriver, updateDriver, deleteDriver } from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getDrivers)
  .post(protect, createDriver);

router.route("/:id")
  .put(protect, updateDriver)
  .delete(protect, deleteDriver);

export default router;
