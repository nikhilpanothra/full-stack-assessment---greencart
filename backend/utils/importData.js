import fs from "fs";
import path from "path";
import csv from "csv-parser";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import Order from "../models/Order.js";

dotenv.config();
connectDB();

const importCSV = (fileName, model, transformFn) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(process.cwd(), "data", fileName);
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(transformFn(data)))
      .on("end", async () => {
        try {
          const filtered = results.filter(Boolean); // Remove nulls
          await model.deleteMany();
          await model.insertMany(filtered);
          console.log(`✅ Imported ${filtered.length} records into ${model.modelName}`);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
};

const startImport = async () => {
  try {
    // DRIVERS
    await importCSV("drivers.csv", Driver, (row) => {
      const name = row.name;
      const currentShiftHours = row.shift_hours; // CSV column
      const past7Day = row.past_week_hours; // CSV column, pipe separated

      if (!name || !currentShiftHours || !past7Day) {
        console.warn(`⚠️ Skipping driver row due to missing data: ${JSON.stringify(row)}`);
        return null;
      }

      return {
        name,
        currentShiftHours: Number(currentShiftHours),
        past7DayHours: past7Day.split("|").map(Number) // Convert to number array
      };
    });

    // ROUTES
    await importCSV("routes.csv", Route, (row) => {
      const routeId = row.route_id;
      const distance = row.distance_km;
      const trafficLevel = row.traffic_level;
      const baseTime = row.base_time_min;

      if (!routeId || !distance || !trafficLevel || !baseTime) {
        console.warn(`⚠️ Skipping route row due to missing data: ${JSON.stringify(row)}`);
        return null;
      }

      return {
        routeId,
        distance: Number(distance),
        trafficLevel,
        baseTime: Number(baseTime)
      };
    });

    // ORDERS
    await importCSV("orders.csv", Order, (row) => {
      const orderId = row.order_id;
      const valueRs = row.value_rs;
      const assignedRoute = row.route_id; // Matches route_id from CSV
      const deliveryTime = row.delivery_time; // Format: "HH:MM"

      if (!orderId || !valueRs || !assignedRoute || !deliveryTime) {
        console.warn(`⚠️ Skipping order row due to missing data: ${JSON.stringify(row)}`);
        return null;
      }

      // Combine a fixed date with time string so Date object is valid
      const deliveryTimestamp = new Date(`2024-01-01T${deliveryTime}:00`);

      return {
        orderId,
        valueRs: Number(valueRs),
        assignedRoute,
        deliveryTimestamp
      };
    });

    console.log("🎯 All data imported successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

startImport();
