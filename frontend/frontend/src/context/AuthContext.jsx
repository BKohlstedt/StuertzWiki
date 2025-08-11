// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/profile");
        if (!res.data.user?.role) {
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        setUser({
          email: res.data.user.email,
          role: res.data.user.role.toLowerCase(),
          permissions: res.data.user.permissions,
        });
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    await api.post("/login", { email, password });
    const res = await api.get("/profile");
    if (!res.data.user?.role) {
      throw new Error("Rolle nicht gefunden");
    }
    const userData = {
      email: res.data.user.email,
      role: res.data.user.role.toLowerCase(),
      permissions: res.data.user.permissions,
    };
    setUser(userData);
    setIsAuthenticated(true);
    return userData;  // Wichtig: Rückgabe der User-Daten für Login-Komponente
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
