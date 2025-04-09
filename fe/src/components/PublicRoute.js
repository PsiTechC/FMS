// components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PublicRoute = ({ children }) => {
  const isAuthenticated = Cookies.get("auth");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
