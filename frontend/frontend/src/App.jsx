// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import SuperuserLayout from "./components/SuperuserLayout";
import WikiLayout from "./components/WikiLayout";

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
import PageDetail from "./pages/wiki/PageDetail";
import TopicDetail from "./pages/wiki/TopicDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Öffentliche Login-Seite */}
          <Route path="/" element={<Login />} />

          {/* Admin-Bereich - nur für Admins */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Benutzerverwaltung />} />
              <Route path="/admin/content" element={<ContentVerwaltung />} />
              <Route path="/admin/invite" element={<UserEinladung />} />
              <Route path="/admin/overview" element={<Uebersicht />} />

              {/* Nur Admins mit spezieller Berechtigung */}
              <Route element={<ProtectedRoute requiredPermission="manage_permissions" />}>
                <Route path="/admin/permissions" element={<Berechtigungen />} />
              </Route>
            </Route>
          </Route>

          {/* Superuser-Bereich - nur für Superuser */}
          <Route element={<ProtectedRoute requiredRole="SUPERUSER" />}>
            <Route element={<SuperuserLayout />}>
              <Route path="/superuser/dashboard" element={<SuperuserDashboard />} />
              {/* Weitere Superuser-Routen hier */}
            </Route>
          </Route>

          {/* Wiki-Bereich - nur für User und Superuser */}
          <Route element={<ProtectedRoute requiredRole={["USER", "SUPERUSER"]} />}>
            <Route element={<WikiLayout />}>
              <Route path="/wiki" element={<WikiStartseite />} />
              <Route path="/wiki/department/:id" element={<DepartmentDetail />} />
              <Route path="/wiki/page/:id" element={<PageDetail />} />
              <Route path="/wiki/topic/:id" element={<TopicDetail />} />
              {/* Weitere Wiki-Routen hier */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
