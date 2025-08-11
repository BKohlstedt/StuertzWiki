import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link to="/admin/dashboard" className="navbar-brand">Stürtz Wiki</Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item"><Link to="/admin/users" className="nav-link">Benutzerverwaltung</Link></li>
          <li className="nav-item"><Link to="/admin/content" className="nav-link">Content Verwaltung</Link></li>
          <li className="nav-item"><Link to="/admin/invite" className="nav-link">User Einladung</Link></li>
          <li className="nav-item"><Link to="/admin/permissions" className="nav-link">Berechtigungen</Link></li>
          <li className="nav-item"><Link to="/admin/overview" className="nav-link">Übersicht</Link></li>
        </ul>

        <span className="navbar-text text-white me-3">{user?.email}</span>
        <button onClick={logout} className="btn btn-outline-light btn-sm">Logout</button>
      </div>
    </nav>
  );
}
