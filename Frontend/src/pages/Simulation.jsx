import React, { useState } from "react";
import API from "../services/api";

export default function Simulation() {
  const [numberOfDrivers, setNumberOfDrivers] = useState("");
  const [startTime, setStartTime] = useState("");
  const [maxHoursPerDay, setMaxHoursPerDay] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/simulation", {
        numberOfDrivers: Number(numberOfDrivers),
        startTime,
        maxHoursPerDay: Number(maxHoursPerDay),
      });

      setResult(data);

      // Notify dashboard to refresh
      window.dispatchEvent(new Event("simulationUpdated"));
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to run simulation"));
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 pt-16 md:p-10">
     
      <form
        onSubmit={handleRunSimulation}
        className="max-w-xl bg-white rounded-xl shadow-lg p-8 my-16 mx-auto space-y-6"
        aria-label="Simulation form"
      >
        <div>
          <label htmlFor="drivers" className="block text-gray-700 font-semibold mb-2">
            Number of Drivers
          </label>
          <input
            id="drivers"
            type="number"
            min="1"
            className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={numberOfDrivers}
            onChange={(e) => setNumberOfDrivers(e.target.value)}
            required
            placeholder="Enter number of drivers"
          />
        </div>

        <div>
          <label htmlFor="startTime" className="block text-gray-700 font-semibold mb-2">
            Start Time
          </label>
          <input
            id="startTime"
            type="time"
            className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="maxHours" className="block text-gray-700 font-semibold mb-2">
            Max Hours Per Day
          </label>
          <input
            id="maxHours"
            type="number"
            min="1"
            className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={maxHoursPerDay}
            onChange={(e) => setMaxHoursPerDay(e.target.value)}
            required
            placeholder="Enter max working hours per day"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } shadow-md`}
        >
          {loading ? "Running Simulation..." : "Run Simulation"}
        </button>
      </form>

      {/* Result section */}
      {result && (
        <section className="max-w-xl mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">
            Simulation Results
          </h2>
          <div className="space-y-3 text-gray-700 text-lg">
            <p>
              <span className="font-semibold text-gray-900">Total Profit:</span>{" "}
              ₹{result.totalProfit.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Efficiency Score:</span>{" "}
              {result.efficiencyScore}%
            </p>
            <p>
              <span className="font-semibold text-gray-900">On-Time Deliveries:</span>{" "}
              {result.onTimeDeliveries}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Late Deliveries:</span>{" "}
              {result.lateDeliveries}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Total Deliveries:</span>{" "}
              {result.totalDeliveries}
            </p>

            <h3 className="mt-6 font-semibold text-gray-900 text-xl border-t border-gray-300 pt-4">
              Fuel Cost Breakdown
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Low Traffic: ₹{result.fuelCostBreakdown.Low.toFixed(2)}</li>
              <li>Medium Traffic: ₹{result.fuelCostBreakdown.Medium.toFixed(2)}</li>
              <li>High Traffic: ₹{result.fuelCostBreakdown.High.toFixed(2)}</li>
            </ul>
          </div>
        </section>
      )}
    </main>
  );
}
