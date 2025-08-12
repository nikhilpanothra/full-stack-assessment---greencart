import asyncHandler from "express-async-handler";
import Route from "../models/Route.js";

export const getRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

export const createRoute = asyncHandler(async (req, res) => {
  const { routeId, distance, trafficLevel, baseTime } = req.body;
  if (!routeId || distance === undefined || !trafficLevel || baseTime === undefined) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const route = await Route.create({ routeId, distance, trafficLevel, baseTime });
  res.status(201).json(route);
});

export const updateRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }
  Object.assign(route, req.body);
  await route.save();
  res.json(route);
});

export const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) {
    res.status(404);
    throw new Error("Route not found");
  }
  await route.deleteOne();
  res.json({ message: "Route removed" });
});
