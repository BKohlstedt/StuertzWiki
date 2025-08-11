// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
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

          {/* Admin-Bereich - nur Admins */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Benutzerverwaltung />} />
              <Route path="/admin/content" element={<ContentVerwaltung />} />
              <Route path="/admin/invite" element={<UserEinladung />} />
              <Route path="/admin/overview" element={<Uebersicht />} />
              <Route
                element={<ProtectedRoute requiredPermission="manage_permissions" />}
              >
                <Route path="/admin/permissions" element={<Berechtigungen />} />
              </Route>
            </Route>
          </Route>

          {/* Superuser-Bereich - nur Superuser */}
          <Route element={<ProtectedRoute requiredRole="SUPERUSER" />}>
            <Route element={<SuperuserLayout />}>
              <Route path="/superuser/dashboard" element={<SuperuserDashboard />} />
              {/* Hier kannst du weitere Superuser-spezifische Routen ergänzen */}
            </Route>
          </Route>

          {/* Wiki-Bereich - nur User & Superuser */}
          <Route element={<ProtectedRoute requiredRole={["USER", "SUPERUSER"]} />}>
            <Route path="/wiki" element={<WikiStartseite />} />
            <Route path="/wiki/department/:id" element={<DepartmentDetail />} />
            {/* Weitere Wiki-Routen */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
