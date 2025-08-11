// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" />;

  if (requiredRole) {
    if (Array.isArray(requiredRole)) {
      if (!user || !requiredRole.includes(user.role.toUpperCase())) {
        return (
          <div className="container mt-5 pt-5 text-center">
            <h3>Keine Berechtigung</h3>
            <p>Du hast keine Zugriffsrechte auf diese Seite.</p>
          </div>
        );
      }
    } else {
      if (!user || user.role.toUpperCase() !== requiredRole.toUpperCase()) {
        return (
          <div className="container mt-5 pt-5 text-center">
            <h3>Keine Berechtigung</h3>
            <p>Du hast keine Zugriffsrechte auf diese Seite.</p>
          </div>
        );
      }
    }
  }

  return <Outlet />;
}
