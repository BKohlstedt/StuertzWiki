// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./components/AdminLayout";
import SuperuserLayout from "./components/SuperuserLayout";

import Login from "./pages/Login";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Benutzerverwaltung from "./pages/admin/Benutzerverwaltung";
import ContentVerwaltung from "./pages/admin/ContentVerwaltung";
import UserEinladung from "./pages/admin/UserEinladung";
import Berechtigungen from "./pages/admin/Berechtigungen";
import Uebersicht from "./pages/admin/Uebersicht";

import SuperuserDashboard from "./pages/superuser/SuperuserDashboard";

import WikiStartseite from "./pages/wiki/WikiStartseite";
import DepartmentDetail from "./pages/wiki/DepartmentDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Admin-Bereich nur für Admins */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Benutzerverwaltung />} />
              <Route path="/admin/content" element={<ContentVerwaltung />} />
              <Route path="/admin/invite" element={<UserEinladung />} />
              <Route path="/admin/overview" element={<Uebersicht />} />
              <Route
                element={<ProtectedRoute requiredRole="admin" />}
              >
                <Route path="/admin/permissions" element={<Berechtigungen />} />
              </Route>
            </Route>
          </Route>

          {/* Superuser-Bereich nur für Superuser */}
          <Route element={<ProtectedRoute requiredRole="superuser" />}>
            <Route element={<SuperuserLayout />}>
              <Route
                path="/superuser/dashboard"
                element={<SuperuserDashboard />}
              />
              {/* Hier weitere Superuser-Routen */}
            </Route>
          </Route>

          {/* Wiki nur für User & Superuser */}
          <Route element={<ProtectedRoute requiredRole={["user", "superuser"]} />}>
            <Route path="/wiki" element={<WikiStartseite />} />
            <Route path="/wiki/department/:id" element={<DepartmentDetail />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
