import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  valueRs: { type: Number, required: true },
  assignedRoute: { type: String, required: true },
  deliveryTimestamp: { type: Date, required: true }
});

export default mongoose.model("Order", orderSchema);
