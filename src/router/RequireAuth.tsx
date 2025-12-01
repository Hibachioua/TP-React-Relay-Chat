// src/router/RequireAuth.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getSession } from "../user/loginApi";

export default function RequireAuth() {
  const location = useLocation();
  const session = getSession();
  const isAuthenticated = !!session?.token;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />; 
}
