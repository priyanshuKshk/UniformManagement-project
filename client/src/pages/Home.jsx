import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto mt-16 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-6">
          Uniform Distribution Dashboard
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Seamlessly handle your school's uniform inventory. Add new items or
          review your current stock with just a click.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
          <Link
            to="/add"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition"
          >
            ➕ Add New Uniform
          </Link>
          <Link
            to="/inventory"
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium shadow-md transition"
          >
            📦 Check Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
