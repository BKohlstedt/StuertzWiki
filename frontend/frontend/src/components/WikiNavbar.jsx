// src/components/WikiNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function WikiNavbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/wiki">
        Wiki Startseite
      </Link>
      <div className="ms-auto">
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
