import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Loader } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [valueRs, setValueRs] = useState("");
  const [assignedRoute, setAssignedRoute] = useState("");
  const [deliveryTimestamp, setDeliveryTimestamp] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Add or Update order
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        orderId,
        valueRs: Number(valueRs),
        assignedRoute,
        deliveryTimestamp,
      };

      if (editId) {
        await API.put(`/orders/${editId}`, payload);
        setEditId(null);
      } else {
        await API.post("/orders", payload);
      }

      // Reset form
      setOrderId("");
      setValueRs("");
      setAssignedRoute("");
      setDeliveryTimestamp("");
      fetchOrders();
    } catch (err) {
      alert("Failed to save order: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await API.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order: " + (err.response?.data?.message || err.message));
    }
  };

  // Start edit mode
  const startEdit = (order) => {
    setEditId(order._id);
    setOrderId(order.orderId);
    setValueRs(order.valueRs);
    setAssignedRoute(order.assignedRoute);
    setDeliveryTimestamp(new Date(order.deliveryTimestamp).toISOString().slice(0, 16));
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to form when editing
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditId(null);
    setOrderId("");
    setValueRs("");
    setAssignedRoute("");
    setDeliveryTimestamp("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-500">
        <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 my-12 to-indigo-50 p-6 md:p-10">
     
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-indigo-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Order ID</label>
            <input
              type="text"
              placeholder="Order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Value (₹)</label>
            <input
              type="number"
              placeholder="Value (₹)"
              value={valueRs}
              onChange={(e) => setValueRs(e.target.value)}
              min="0"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Assigned Route</label>
            <input
              type="text"
              placeholder="Assigned Route"
              value={assignedRoute}
              onChange={(e) => setAssignedRoute(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700">Delivery Time</label>
            <input
              type="datetime-local"
              value={deliveryTimestamp}
              onChange={(e) => setDeliveryTimestamp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button
            type="submit"
            className={`px-8 py-3 rounded-3xl font-extrabold text-white shadow-lg transition-transform active:scale-95 ${
              editId ? "bg-indigo-700 hover:bg-indigo-800" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {editId ? "Update Order" : "Add Order"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-8 py-3 rounded-3xl font-extrabold bg-gray-400 hover:bg-gray-500 text-white shadow-lg transition-transform active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <p className="mt-20 text-center text-lg text-gray-500 font-semibold">
          No orders found. Please add some orders above.
        </p>
      ) : (
        <div className="overflow-x-auto mt-12 max-w-7xl mx-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <thead className="bg-indigo-100 text-indigo-800 font-semibold">
              <tr>
                <th className="p-4 border-b border-indigo-300 text-left">Order ID</th>
                <th className="p-4 border-b border-indigo-300 text-left">Value (₹)</th>
                <th className="p-4 border-b border-indigo-300 text-left">Route</th>
                <th className="p-4 border-b border-indigo-300 text-left">Delivery Time</th>
                <th className="p-4 border-b border-indigo-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o._id}
                  className="hover:bg-indigo-50 transition-colors cursor-default"
                >
                  <td className="p-4 border-b border-indigo-200">{o.orderId}</td>
                  <td className="p-4 border-b border-indigo-200">₹{o.valueRs}</td>
                  <td className="p-4 border-b border-indigo-200">{o.assignedRoute}</td>
                  <td className="p-4 border-b border-indigo-200">
                    {new Date(o.deliveryTimestamp).toLocaleString()}
                  </td>
                  <td className="p-4 border-b border-indigo-200 flex gap-3">
                    <button
                      onClick={() => startEdit(o)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition active:scale-95"
                      aria-label={`Edit order ${o.orderId}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteOrder(o._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition active:scale-95"
                      aria-label={`Delete order ${o.orderId}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
