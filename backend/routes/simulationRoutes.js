import express from "express";
import { getSimulationHistory, runSimulation } from "../controllers/simulationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, runSimulation);
router.get("/history", protect, getSimulationHistory);

export default router;
