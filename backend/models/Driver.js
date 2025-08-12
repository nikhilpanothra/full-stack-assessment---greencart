import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentShiftHours: { type: Number, required: true },
  past7DayHours: { type: [Number], default: [] }
}, { timestamps: true });

export default mongoose.model("Driver", driverSchema);
