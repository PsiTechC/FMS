// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Cookies.get("auth"); // checks if auth cookie exists
  return isAuthenticated ? children : <Navigate to="/Loginn" replace />;
};

export default ProtectedRoute;
