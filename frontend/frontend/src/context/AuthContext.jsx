import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/profile");
        if (!res.data.user?.role) throw new Error("Rolle nicht gefunden");
        setUser({
          email: res.data.user.email,
          role: res.data.user.role.toLowerCase(),
          permissions: res.data.user.permissions,
        });
        setIsAuthenticated(true);
        redirectByRole(res.data.user.role.toLowerCase());
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const redirectByRole = (role) => {
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "superuser") navigate("/superuser/dashboard");
    else if (role === "user") navigate("/wiki");
  };

  const login = async (email, password) => {
    try {
      await api.post("/login", { email, password });
      const res = await api.get("/profile");
      if (!res.data.user?.role) throw new Error("Rolle nicht gefunden");
      setUser({
        email: res.data.user.email,
        role: res.data.user.role.toLowerCase(),
        permissions: res.data.user.permissions,
      });
      setIsAuthenticated(true);
      redirectByRole(res.data.user.role.toLowerCase());
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
