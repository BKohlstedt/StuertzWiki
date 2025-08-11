// src/components/WikiLayout.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Outlet, Link } from "react-router-dom";

export default function WikiLayout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (err) {
      console.error("Logout fehlgeschlagen", err);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/wiki">
          StuertzWiki
        </Link>
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3">Angemeldet als: {user?.email}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
}
