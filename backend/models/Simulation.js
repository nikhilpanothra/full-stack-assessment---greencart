import mongoose from "mongoose";

const simulationSchema = new mongoose.Schema(
  {
    totalProfit: { type: Number, required: true },
    efficiencyScore: { type: Number, required: true },
    onTimeDeliveries: { type: Number, required: true },
    lateDeliveries: { type: Number, required: true }, // ✅ Added
    totalDeliveries: { type: Number, required: true },
    fuelCostLow: { type: Number, required: true },
    fuelCostMedium: { type: Number, required: true },
    fuelCostHigh: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Simulation", simulationSchema);
