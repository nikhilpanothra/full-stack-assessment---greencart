import asyncHandler from "express-async-handler";
import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import Order from "../models/Order.js";
import Simulation from "../models/Simulation.js";

// Run Simulation
// @desc Run delivery simulation
// @route POST /api/simulation
// @access Private
export const runSimulation = asyncHandler(async (req, res) => {
  const { numberOfDrivers, startTime, maxHoursPerDay } = req.body;

  if (!numberOfDrivers || !startTime || maxHoursPerDay === undefined || numberOfDrivers <= 0 || maxHoursPerDay <= 0) {
    res.status(400);
    throw new Error("Invalid simulation input");
  }

  const drivers = await Driver.find().limit(numberOfDrivers);
  const routes = await Route.find();
  const orders = await Order.find();

  if (drivers.length === 0 || routes.length === 0 || orders.length === 0) {
    res.status(400);
    throw new Error("Insufficient data for simulation");
  }

  let totalProfit = 0;
  let onTimeDeliveries = 0;
  let lateDeliveries = 0; // ✅ Added
  let totalDeliveries = 0;
  let fuelCostLow = 0;
  let fuelCostHigh = 0;
  let fuelCostMedium = 0;

  let driverIndex = 0;
  orders.forEach((order) => {
    const driver = drivers[driverIndex];
    const route = routes.find((r) => r.routeId === order.assignedRoute);
    if (!route) {
      driverIndex = (driverIndex + 1) % drivers.length;
      return;
    }

    let deliveryTime = route.baseTime;
    if (driver.currentShiftHours > 8) {
      deliveryTime *= 1.3;
    }

    let fuelCost = route.distance * 5;
    if (route.trafficLevel === "High") {
      fuelCost += route.distance * 2;
      fuelCostHigh += fuelCost;
    } else if (route.trafficLevel === "Medium") {
      fuelCostMedium += fuelCost;
    } else {
      fuelCostLow += fuelCost;
    }

    const allowedTime = route.baseTime + 10;
    let penalty = 0;
    if (deliveryTime > allowedTime) {
      penalty = 50;
      lateDeliveries++; // ✅ Count here
    }

    let bonus = 0;
    if (order.valueRs > 1000 && penalty === 0) {
      bonus = order.valueRs * 0.1;
    }

    const profit = order.valueRs + bonus - penalty - fuelCost;
    totalProfit += profit;

    if (penalty === 0) {
      onTimeDeliveries++;
    }
    totalDeliveries++;

    driver.currentShiftHours += deliveryTime / 60;
    driverIndex = (driverIndex + 1) % drivers.length;
  });

  const efficiencyScore = totalDeliveries === 0 ? 0 : Number(((onTimeDeliveries / totalDeliveries) * 100).toFixed(2));

  const savedResult = await Simulation.create({
    totalProfit,
    efficiencyScore,
    onTimeDeliveries,
    lateDeliveries, // ✅ save to DB
    totalDeliveries,
    fuelCostLow,
    fuelCostMedium,
    fuelCostHigh,
    timestamp: new Date()
  });

  res.json({
    message: "Simulation completed",
    totalProfit,
    efficiencyScore,
    onTimeDeliveries,
    lateDeliveries, // ✅ return in response
    totalDeliveries,
    fuelCostBreakdown: { Low: fuelCostLow, Medium: fuelCostMedium, High: fuelCostHigh },
    savedResult,
  });
});

// @desc Get simulation history
// @route GET /api/simulation/history
// @access Private
export const getSimulationHistory = asyncHandler(async (req, res) => {
  const history = await Simulation.find().sort({ createdAt: -1 });

  // ✅ Make sure lateDeliveries is included in the response
  res.json(history.map(h => ({
    ...h._doc,
    lateDeliveries: h.lateDeliveries || (h.totalDeliveries - h.onTimeDeliveries) // fallback if old data
  })));
});
