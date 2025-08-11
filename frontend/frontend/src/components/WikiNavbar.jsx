// src/components/WikiNavbar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function WikiNavbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <a className="navbar-brand" href="/wiki">
        Wiki Startseite
      </a>
      <div className="ms-auto">
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
