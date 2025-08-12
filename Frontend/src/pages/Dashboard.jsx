import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/simulation/history");
      if (res.data.length > 0) {
        setData(res.data[0]); // latest
        setHistory(res.data);
      } else {
        setData(null);
        setHistory([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener("simulationUpdated", handleUpdate);

    return () => {
      window.removeEventListener("simulationUpdated", handleUpdate);
    };
  }, []);

  // Custom label for Pie chart (percentages)
  const renderLabel = ({ name, percent }) =>
    `${name}: ${(percent * 100).toFixed(0)}%`;

  // Placeholder chart data (no data)
  const placeholderData = [{ name: "No Data", value: 1, color: "#d1d5db" }];

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center space-y-8">
        <p className="text-gray-500 text-lg font-semibold text-center max-w-md">
          No simulation data available yet. Please run a simulation to see results.
        </p>

        {/* Placeholder charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Fuel Cost Placeholder */}
          <section
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-72"
            aria-label="Fuel Cost Breakdown placeholder"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
              Fuel Cost Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={placeholderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={() => "No Data"}
                  fill="#d1d5db"
                >
                  <Cell fill="#d1d5db" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>

          {/* Delivery Placeholder */}
          <section
            className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center h-72"
            aria-label="On-Time vs Late Deliveries placeholder"
          >
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
              On-Time vs Late Deliveries
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={placeholderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={() => "No Data"}
                  fill="#d1d5db"
                >
                  <Cell fill="#d1d5db" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </section>
        </div>
      </main>
    );
  }

  const fuelData = [
    { name: "Low", value: data.fuelCostLow, color: "#22c55e" },
    { name: "Medium", value: data.fuelCostMedium, color: "#eab308" },
    { name: "High", value: data.fuelCostHigh, color: "#f87171" },
  ];

  const deliveryData = [
    { name: "On-Time", value: data.onTimeDeliveries, color: "#3b82f6" },
    { name: "Late", value: data.lateDeliveries, color: "#ef4444" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-6 pt-22 md:p-22 space-y-8">
      {/* Summary Cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        aria-label="Summary cards"
      >
        {[
          {
            title: "Total Profit",
            value: `₹${data.totalProfit.toFixed(2)}`,
            color: "text-green-600",
          },
          {
            title: "Efficiency Score",
            value: `${data.efficiencyScore}%`,
            color: "text-blue-600",
          },
        ].map(({ title, value, color }) => (
          <article
            key={title}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center transform transition-transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
            <p className={`text-4xl font-extrabold ${color} select-none`}>
              {value}
            </p>
          </article>
        ))}
      </section>

      {/* Charts */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        aria-label="Charts section"
      >
        {/* Fuel Cost Breakdown */}
        <div
          className="bg-white p-6 rounded-xl shadow-md"
          role="region"
          aria-labelledby="fuel-cost-chart-title"
        >
          <h3
            id="fuel-cost-chart-title"
            className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2"
          >
            Fuel Cost Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={fuelData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderLabel}
                labelLine={false}
              >
                {fuelData.map(({ color }, index) => (
                  <Cell key={`fuel-cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `₹${value.toFixed(2)}`}
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* On-Time vs Late Deliveries */}
        <div
          className="bg-white p-6 rounded-xl shadow-md"
          role="region"
          aria-labelledby="delivery-chart-title"
        >
          <h3
            id="delivery-chart-title"
            className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2"
          >
            On-Time vs Late Deliveries
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={deliveryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderLabel}
                labelLine={false}
              >
                {deliveryData.map(({ color }, index) => (
                  <Cell key={`delivery-cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Simulations Table */}
      <section
        className="bg-white rounded-xl shadow-md p-6 overflow-x-auto"
        aria-label="Recent Simulations Table"
      >
        <h3 className="text-lg font-bold text-gray-700 mb-4 border-b border-gray-200 pb-2">
          Recent Simulations
        </h3>
        <table
          className="w-full table-auto border-collapse text-left"
          role="table"
          aria-describedby="recent-simulations-desc"
        >
          <caption id="recent-simulations-desc" className="sr-only">
            List of recent simulation results including date, profit, efficiency,
            delivery on-time and late counts, and total deliveries.
          </caption>
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {[
                "Date",
                "Profit",
                "Efficiency",
                "On-Time",
                "Late",
                "Total Deliveries",
              ].map((head) => (
                <th
                  key={head}
                  className="border-b border-gray-300 p-3 font-semibold text-gray-600"
                  scope="col"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((sim, idx) => (
              <tr
                key={sim.timestamp + idx}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="p-3 whitespace-nowrap">
                  {new Date(sim.timestamp).toLocaleString()}
                </td>
                <td className="p-3 text-green-600 font-semibold">
                  ₹{sim.totalProfit.toFixed(2)}
                </td>
                <td className="p-3">{sim.efficiencyScore}%</td>
                <td className="p-3 text-blue-600">{sim.onTimeDeliveries}</td>
                <td className="p-3 text-red-600">{sim.lateDeliveries}</td>
                <td className="p-3">{sim.totalDeliveries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
