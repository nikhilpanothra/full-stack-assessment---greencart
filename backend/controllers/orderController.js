import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

export const createOrder = asyncHandler(async (req, res) => {
  const { orderId, valueRs, assignedRoute, deliveryTimestamp } = req.body;
  if (!orderId || valueRs === undefined || !assignedRoute || !deliveryTimestamp) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const order = await Order.create({
    orderId,
    valueRs,
    assignedRoute,
    deliveryTimestamp
  });
  res.status(201).json(order);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  Object.assign(order, req.body);
  await order.save();
  res.json(order);
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  await order.deleteOne();
  res.json({ message: "Order removed" });
});
