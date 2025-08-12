import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Loader } from "lucide-react";

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    routeId: "",
    distance: "",
    trafficLevel: "Low",
    baseTime: "",
  });

  // Fetch routes from backend
  const fetchRoutes = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/routes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoutes(data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Add or Update Route
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editId) {
        await API.put(`/routes/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/routes", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      fetchRoutes();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving route");
    }
  };

  // Delete Route
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/routes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRoutes();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting route");
    }
  };

  // Start Edit Mode
  const handleEdit = (route) => {
    setEditId(route._id);
    setFormData({
      routeId: route.routeId,
      distance: route.distance,
      trafficLevel: route.trafficLevel,
      baseTime: route.baseTime,
    });
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to form on edit
  };

  // Reset form
  const resetForm = () => {
    setEditId(null);
    setFormData({
      routeId: "",
      distance: "",
      trafficLevel: "Low",
      baseTime: "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl font-semibold text-gray-500">
       <Loader/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 my-12 to-pink-50 p-6 md:p-10">
      {/* Frm */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-indigo-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Route ID</label>
            <input
              type="text"
              placeholder="Route ID"
              value={formData.routeId}
              onChange={(e) =>
                setFormData({ ...formData, routeId: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Distance (km)</label>
            <input
              type="number"
              placeholder="Distance (km)"
              value={formData.distance}
              onChange={(e) =>
                setFormData({ ...formData, distance: e.target.value })
              }
              min="0"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Traffic Level</label>
            <select
              value={formData.trafficLevel}
              onChange={(e) =>
                setFormData({ ...formData, trafficLevel: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Base Time (mins)</label>
            <input
              type="number"
              placeholder="Base Time (mins)"
              value={formData.baseTime}
              onChange={(e) =>
                setFormData({ ...formData, baseTime: e.target.value })
              }
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
              required
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button
            type="submit"
            className={`px-8 py-3 rounded-3xl font-extrabold text-white shadow-lg
              ${
                editId
                  ? "bg-purple-700 hover:bg-purple-800 active:scale-95 transition-transform"
                  : "bg-green-600 hover:bg-green-700 active:scale-95 transition-transform"
              }
            `}
          >
            {editId ? "Update Route" : "Add Route"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 rounded-3xl font-extrabold bg-gray-400 hover:bg-gray-500 text-white shadow-lg active:scale-95 transition-transform"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Routes Grid */}
      {routes.length === 0 ? (
        <p className="text-center mt-20 text-lg text-gray-500 font-semibold">
          No routes found. Add your first route above!
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {routes.map((route) => (
            <div
              key={route._id}
              className="bg-white rounded-3xl shadow-xl p-6 border border-indigo-100 hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold mb-3 text-indigo-900">
                Route: <span className="text-indigo-700">{route.routeId}</span>
              </h2>
              <p className="text-gray-700 text-lg mb-2">
                <strong>Distance:</strong> {route.distance} km
              </p>
              <p className="mb-2">
                <strong>Traffic Level:</strong>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold  ${
                    route.trafficLevel === "High"
                      ? "text-red-600"
                      : route.trafficLevel === "Medium"
                      ? "text-yellow-500 "
                      : "text-green-600"
                  }`}
                >
                  {route.trafficLevel}
                </span>
              </p>
              <p className="text-gray-700 text-lg mb-4">
                <strong>Base Time:</strong> {route.baseTime} mins
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(route)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-5 py-2 shadow-md transition active:scale-95"
                  aria-label={`Edit route ${route.routeId}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(route._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-5 py-2 shadow-md transition active:scale-95"
                  aria-label={`Delete route ${route.routeId}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
