import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT

app.use(cors({
    origin:"https://full-stack-assessment-greencart-o4o.vercel.app", 
    credentials: true
}));
app.use(express.json());

// ✅ API routes
import authRoutes from "./routes/authRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => console.log("Server running on port 5000"));
