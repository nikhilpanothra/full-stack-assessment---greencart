import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [name, setName] = useState("");
  const [currentShiftHours, setCurrentShiftHours] = useState("");
  const [past7DayHours, setPast7DayHours] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Drivers
  const fetchDrivers = async () => {
    try {
      const { data } = await API.get("/drivers");
      setDrivers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add or Update Driver
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name,
        currentShiftHours: Number(currentShiftHours),
        past7DayHours: past7DayHours
          ? past7DayHours.split(",").map((num) => Number(num.trim()))
          : [],
      };

      if (editId) {
        await API.put(`/drivers/${editId}`, payload);
        setEditId(null);
      } else {
        await API.post("/drivers", payload);
      }

      setName("");
      setCurrentShiftHours("");
      setPast7DayHours("");
      fetchDrivers();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Driver
  const deleteDriver = async (id) => {
    if (window.confirm("Are you sure you want to delete this driver?")) {
      try {
        await API.delete(`/drivers/${id}`);
        fetchDrivers();
      } catch (err) {
        alert("Failed to delete driver.");
        console.error(err);
      }
    }
  };

  // Edit Driver
  const startEdit = (driver) => {
    setEditId(driver._id);
    setName(driver.name);
    setCurrentShiftHours(driver.currentShiftHours);
    setPast7DayHours(
      Array.isArray(driver.past7DayHours) ? driver.past7DayHours.join(", ") : ""
    );
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-14 my-12 md:p-10 space-y-8">
    
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0"
      >
        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
            required
            disabled={loading}
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-1">
            Current Shift Hours
          </label>
          <input
            type="number"
            value={currentShiftHours}
            onChange={(e) => setCurrentShiftHours(e.target.value)}
            placeholder="Hours"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
            required
            disabled={loading}
            min={0}
          />
        </div>

        <div className="flex-1">
          <label className="block text-gray-700 font-semibold mb-1">
            Past 7 Day Hours (comma separated)
          </label>
          <input
            value={past7DayHours}
            onChange={(e) => setPast7DayHours(e.target.value)}
            placeholder="e.g. 8,7,6,8,7,6,5"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-600 transition"
            disabled={loading}
          />
        </div>

        <div className="flex space-x-3 mt-2 md:mt-0">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-bold text-white shadow-md
              transition-transform duration-200
              ${
                editId
                  ? "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                  : "bg-green-600 hover:bg-green-700 active:scale-95"
              }
              ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
          >
            {loading ? (
              <span className="inline-block animate-spin w-5 h-5 border-4 border-white border-t-transparent rounded-full"></span>
            ) : editId ? (
              "Update"
            ) : (
              "Add"
            )}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                setCurrentShiftHours("");
                setPast7DayHours("");
              }}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-semibold shadow-md transition active:scale-95"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Drivers Table */}
      <div className="overflow-x-auto rounded-xl shadow-md bg-white">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {["Name", "Shift Hours", "Past 7 Days", "Actions"].map((head) => (
                <th
                  key={head}
                  className="border-b border-gray-300 px-6 py-3 text-left text-gray-600 font-semibold select-none"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, idx) => (
              <tr
                key={d._id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                  {d.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{d.currentShiftHours}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {Array.isArray(d.past7DayHours) ? d.past7DayHours.join(", ") : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                  <button
                    onClick={() => startEdit(d)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1 rounded-lg shadow-sm transition active:scale-95"
                    disabled={loading}
                    aria-label={`Edit driver ${d.name}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteDriver(d._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg shadow-sm transition active:scale-95"
                    disabled={loading}
                    aria-label={`Delete driver ${d.name}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {drivers.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No drivers found. Add some above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
