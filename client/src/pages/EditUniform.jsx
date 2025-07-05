import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function EditUniform() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    itemName: "",
    size: "",
    quantity: "",
    allotted: "",
    available: "",
  });

  useEffect(() => {
    const fetchUniform = async () => {
      if (loading) return;

  setLoading(true);
      try {
        const res = await api.get(`/uniforms/${id}`);
        const data = res.data;

        setForm({
          ...data,
          allotted: data.allotted || 0,
          available: (data.quantity || 0) - (data.allotted || 0),
        });
      } catch (err) {
        toast.error("Failed to load uniform data");
      }finally {
    setLoading(false);
  }
    };

    fetchUniform();
  }, [id]);

const handleChange = (e) => {
  const { name, value } = e.target;
  const updatedForm = { ...form, [name]: value };

  // Auto-calculate available and validate
  if (name === "quantity" || name === "allotted") {
    const quantity = parseInt(name === "quantity" ? value : updatedForm.quantity) || 0;
    const allotted = parseInt(name === "allotted" ? value : updatedForm.allotted) || 0;

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
    try {
      await api.put(`/uniforms/${id}`, form);
      toast.success("Uniform updated successfully");
      navigate("/inventory");
    } catch (err) {
      console.error("Error updating uniform:", err);
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Edit Uniform</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="itemName"
            value={form.itemName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Size</label>
          <input
            type="text"
            name="size"
            value={form.size}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Allotted</label>
          <input
            type="number"
            name="allotted"
            value={form.allotted}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Available</label>
          <input
            type="number"
            name="available"
            value={form.available}
            readOnly
            className="w-full border border-gray-300 bg-gray-100 text-gray-500 rounded px-3 py-2 cursor-not-allowed"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Uniform"}
        </button>
      </form>
    </div>
  );
}
