import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../utils/api";

export default function AllotmentList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/allotments")
      .then(res => {
      //  console.log("✅ Allotment API Response:", res.data);
        setData(res.data.data);
        
      })
      .catch(err => console.error("❌ Failed to load allotments", err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">👤 Allotted Uniforms List</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-3 py-2">Person Name</th>
              <th className="px-3 py-2">Person ID</th>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Size</th>
              <th className="px-3 py-2">Quantity</th>
              <th className="px-3 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map(entry => (
              <tr key={entry._id} className="border-t">
                <td className="px-3 py-2">{entry.personName}</td>
                <td className="px-3 py-2">{entry.personId}</td>
                <td className="px-3 py-2">{entry.uniformId?.itemName}</td>
                <td className="px-3 py-2">{entry.uniformId?.size}</td>
                <td className="px-3 py-2">{entry.quantity}</td>
                <td className="px-3 py-2">
                  {new Date(entry.allottedOn).toLocaleString()}
                </td>
              </tr>
            ))}
            {Array.isArray(data) && data.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-3 text-gray-500">
                  No allotments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
