// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <p>Lädt...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" />;

  if (requiredRole) {
    const rolesArray = Array.isArray(requiredRole)
      ? requiredRole.map((r) => r.toLowerCase())
      : [requiredRole.toLowerCase()];

    if (!user || !rolesArray.includes(user.role.toLowerCase())) {
      return (
        <div className="container mt-5 pt-5 text-center">
          <h3>Keine Berechtigung</h3>
          <p>Du hast keine Zugriffsrechte auf diese Seite.</p>
        </div>
      );
    }
  }

  return <Outlet />;
}
