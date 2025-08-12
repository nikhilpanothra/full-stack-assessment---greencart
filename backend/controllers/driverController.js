import asyncHandler from "express-async-handler";
import Driver from "../models/Driver.js";

// @desc Get all drivers
// @route GET /api/drivers
// @access Private
export const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
});

// @desc Create driver
// @route POST /api/drivers
// @access Private
export const createDriver = asyncHandler(async (req, res) => {
  const { name, currentShiftHours, past7DayHours } = req.body;

  if (!name || currentShiftHours === undefined || !past7DayHours) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const driver = await Driver.create({
    name,
    currentShiftHours,
    past7DayHours
  });

  res.status(201).json(driver);
});

// @desc Update driver
// @route PUT /api/drivers/:id
// @access Private
export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }
  Object.assign(driver, req.body);
  await driver.save();
  res.json(driver);
});

// @desc Delete driver
// @route DELETE /api/drivers/:id
// @access Private
export const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }
  await driver.deleteOne();
  res.json({ message: "Driver removed" });
});
