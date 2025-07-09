import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function AllotUniform() {
  const [uniforms, setUniforms] = useState([]);
  const [form, setForm] = useState({
    uniformId: "",
    personName: "",
    personId: "",
    quantity: 1,
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Function to fetch uniforms
  const fetchUniforms = async () => {
    try {
      const res = await api.get("/uniforms");
      setUniforms(res.data);
    } catch (err) {
      console.error("❌ Error loading uniforms:", err);
    }
  };

  // Fetch all uniforms on mount
  useEffect(() => {
    fetchUniforms();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);
    try {
      await api.post("/allotments", form);
      setMessage("✅ Allotment successful!");
      setForm({ uniformId: "", personName: "", personId: "", quantity: 1 });

      // Refresh uniforms after allotment
      await fetchUniforms();
    } catch (err) {
      const msg = err.response?.data?.message || "Allotment failed";
      setMessage("❌ " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Allot Uniform</h2>

      {message && (
        <div className="mb-4 p-2 border rounded bg-gray-100">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Uniform</label>
          <select
            name="uniformId"
            value={form.uniformId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select Uniform --</option>
            {uniforms
              .filter((item) => item.quantity > 0)
              .map((item) => (
                <option key={item._id} value={item._id}>
                  {item.itemName} (Size: {item.size}) - Qty: {item.quantity}
                </option>
              ))}
            {uniforms.filter((u) => u.quantity > 0).length === 0 && (
              <option disabled>No uniforms in stock</option>
            )}
          </select>
        </div>

        <div>
          <label className="block font-medium">Person Name</label>
          <input
            type="text"
            name="personName"
            value={form.personName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">
            Person ID / Roll No. (optional)
          </label>
          <input
            type="text"
            name="personId"
            value={form.personId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            min="1"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Allotting..." : "Allot"}
        </button>
      </form>
    </div>
  );
}
