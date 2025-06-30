import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Layout from "./components/Layout";
import AddUniform from "./pages/AddUniform";
import Home from "./pages/Home";
import InventoryList from "./pages/Inventory";
import EditUniform from "./pages/EditUniform";
import InventoryDashboard from "./pages/InventoryDashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./pages/PrivateRoute";

import Signup from "./pages/Signup";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "add", element: <AddUniform /> },
      { path: "inventory", element: <InventoryList /> },
      { path: "dashboard", element: <InventoryDashboard /> },
      { path: "edit/:id", element: <EditUniform /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
