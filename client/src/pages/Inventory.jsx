import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Trash, Pencil, Check, X } from "lucide-react";
import { useParams } from "react-router-dom";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const { id } = useParams();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    itemName: "",
    size: "",
    costPrice: "",
    quantity: "",
    allotted: "", // new field
  });
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    const res = await api.get("/uniforms");
    setItems(res.data);
  };

  const deleteItem = async (id) => {
    if (window.confirm("Are you sure to delete this item?")) {
      await api.delete(`/uniforms/${id}`);
      fetchItems();
    }
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setForm({
      itemName: item.itemName || "",
      size: item.size || "",
      costPrice: item.costPrice || "",
      quantity: item.quantity || "",
      allotted: item.allotted || 0,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setForm({
      itemName: "",
      size: "",
      costPrice: "",
      quantity: "",
      allotted: "",
    });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateItem = async (e) => {
  e.preventDefault();

  const quantity = parseInt(form.quantity) || 0;
  const allotted = parseInt(form.allotted) || 0;

  if (quantity < 0) {
    alert("Quantity cannot be negative");
    return;
  }

  if (allotted > quantity) {
    alert("Allotted cannot be more than quantity");
    return;
  }

  try {
    await api.put(`/uniforms/${editingId}`, {
      ...form,
      available: quantity - allotted,
    });
    setEditingId(null);
    fetchItems();
  } catch (err) {
    alert("Update failed");
  }
};


  useEffect(() => {
    if (id) {
      api
        .get(`/uniforms/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    } else {
      fetchItems();
    }
  }, [id]);

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
        Inventory
      </h2>

      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search item by name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const available = item.quantity - (item.allotted || 0);
          const lowStock = available <= 5;

          return (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              {editingId === item._id ? (
                <form onSubmit={updateItem} className="space-y-3">
                  <input
                    name="itemName"
                    value={form.itemName}
                    onChange={handleFormChange}
                    placeholder="Item Name"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />

                  <div className="flex gap-3">
                    <input
                      name="size"
                      value={form.size}
                      onChange={handleFormChange}
                      placeholder="Size"
                      className="w-1/2 px-3 py-2 border rounded-lg"
                      required
                    />
                    <input
                      name="costPrice"
                      type="number"
                      value={form.costPrice}
                      onChange={handleFormChange}
                      placeholder="Cost Price"
                      className="w-1/2 px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <input
                      name="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={handleFormChange}
                      placeholder="Quantity"
                      className="w-1/2 px-3 py-2 border rounded-lg"
                      required
                    />
                    <input
                      name="allotted"
                      type="number"
                      value={form.allotted}
                      onChange={handleFormChange}
                      placeholder="Allotted"
                      className="w-1/2 px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-1"
                    >
                      <Check size={16} /> Update
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 flex items-center gap-1"
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.itemName}
                  </h3>

                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <p><strong>Size:</strong> {item.size}</p>
                    <p><strong>₹</strong> {item.costPrice}</p>
                  </div>

                <div className="mb-3 flex flex-wrap gap-2">
  <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm">
    Total: {item.quantity}
  </span>
  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
    Allotted: {item.allotted || 0}
  </span>
  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
    Available: {available}
  </span>
</div>


                  {lowStock && (
                    <p className="text-sm text-red-600 font-semibold mb-2">
                      ⚠️ Low Stock!
                    </p>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => deleteItem(item._id)}
                    >
                      <Trash size={18} />
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => startEditing(item)}
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
