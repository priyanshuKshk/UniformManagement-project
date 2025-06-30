import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();


  if (!isLoggedIn) {
      return isLoggedIn ? children : <Navigate to="/login" />;
    
  }

  return children;
}
