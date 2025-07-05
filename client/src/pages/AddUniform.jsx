import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export default function AddUniform() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: "",
    size: "",
    costPrice: "",
    quantity: "",
    allotted: "",
    available: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (["costPrice", "quantity", "allotted"].includes(name)) {
      value = value.replace(/^0+(?=\d)/, ""); // prevent leading zeroes
    }

    const updatedForm = { ...form, [name]: value };

    // Auto-calculate available and validate
    if (name === "quantity" || name === "allotted") {
      const quantity =
        parseInt(name === "quantity" ? value : updatedForm.quantity) || 0;
      const allotted =
        parseInt(name === "allotted" ? value : updatedForm.allotted) || 0;

      if (quantity < 0) {
        toast.error("Quantity cannot be negative");
      } else if (allotted > quantity) {
        toast.error("Allotted cannot exceed Quantity");
      }

      updatedForm.available = Math.max(quantity - allotted, 0);
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const quantity = parseInt(form.quantity, 10) || 0;
    const allotted = parseInt(form.allotted, 10) || 0;

    // ✅ Validation
    if (quantity < 0) {
      alert("Quantity cannot be negative");
      return;
    }

    if (allotted > quantity) {
      alert("Allotted cannot be more than Quantity");
      return;
    }

    const available = quantity - allotted;
    if (loading) return;

    setLoading(true);
    try {
      await api.post("/uniforms", { ...form, available });
      toast((t) => (
        <span>
          Uniform added successfully
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/inventory");
            }}
            className="ml-4 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            OK
          </button>
        </span>
      ));
      setForm({
        itemName: "",
        size: "",
        costPrice: "",
        quantity: "",
        allotted: "",
        available: "",
      });
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden flex w-full max-w-4xl">
        {/* Left Panel */}
        <div className="w-1/2 bg-gradient-to-b from-indigo-500 to-purple-500 text-white p-10 hidden md:flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Add a New Uniform</h2>
          <p className="text-sm opacity-80">
            Track your inventory by adding uniforms with their size, cost,
            quantity, and allotment.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <h3 className="text-xl font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3 mb-6">
            Uniform Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-1 text-gray-600">
                Item Name
              </label>
              <input
                name="itemName"
                value={form.itemName}
                onChange={handleChange}
                placeholder="e.g., Shirt"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-600">Size</label>
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="e.g., L, XL"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Cost Price
                </label>
                <input
                  type="number"
                  name="costPrice"
                  value={form.costPrice}
                  onChange={handleChange}
                  placeholder="e.g., 300"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 10"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Allotted
                </label>
                <input
                  type="number"
                  name="allotted"
                  value={form.allotted}
                  onChange={handleChange}
                  placeholder="e.g., 4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Available
                </label>
                <input
                  type="number"
                  name="available"
                  value={form.available}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
            >
              {loading ? "Adding..." : "Add Uniform"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
