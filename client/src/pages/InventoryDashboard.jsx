import React, { useEffect, useState } from "react";
import api from "../utils/api";
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, Legend,
} from "recharts";

const COLORS = ["#34d399", "#f87171"];

export default function InventoryDashboard() {
  const [items, setItems] = useState([]);
  const [sizeFilter, setSizeFilter] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      const res = await api.get("/uniforms");
      setItems(res.data);
    };
    fetchItems();
  }, []);

  const filtered = sizeFilter
    ? items.filter((i) => i.size === sizeFilter)
    : items;

  const lowStockItems = filtered.filter(
    (item) => item.quantity - (item.allotted || 0) <= 5
  );

  const totalQuantity = filtered.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  const totalAllotted = filtered.reduce((sum, i) => sum + Number(i.allotted || 0), 0);
  const totalAvailable = totalQuantity - totalAllotted;

  const sizes = [...new Set(items.map((i) => i.size))];

  const pieData = [
    { name: "Available", value: totalAvailable },
    { name: "Allotted", value: totalAllotted },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Inventory Dashboard</h2>

      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <div className="bg-blue-100 text-blue-700 px-5 py-3 rounded-xl font-semibold">
          Total Quantity: {totalQuantity}
        </div>
        <div className="bg-green-100 text-green-700 px-5 py-3 rounded-xl font-semibold">
          Available: {totalAvailable}
        </div>
        <div className="bg-red-100 text-red-600 px-5 py-3 rounded-xl font-semibold">
          Allotted: {totalAllotted}
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-5 py-3 rounded-xl font-semibold">
          Low Stock: {lowStockItems.length}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6 text-center">
        <label className="mr-2 font-medium">Filter by Size:</label>
        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Sizes</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-4 text-center">Available per Item</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filtered}>
              <XAxis dataKey="itemName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={(item) => item.quantity - (item.allotted || 0)} name="Available" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-4 text-center">Allotted vs Available</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
