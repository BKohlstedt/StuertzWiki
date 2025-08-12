// src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // login gibt den user mit Rolle zurück
      const loggedInUser = await login(email, password);

      // Weiterleitung je nach Rolle
      if (loggedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (loggedInUser.role === "superuser") {
        navigate("/superuser/dashboard");
      } else if (loggedInUser.role === "user") {
        navigate("/wiki");
      } else {
        setError("Unbekannte Rolle, bitte Administrator kontaktieren.");
      }

      setLoading(false);
    } catch (err) {
      setError("Login fehlgeschlagen. Bitte überprüfe deine Eingaben.");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Passwort
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Bitte warten..." : "Anmelden"}
        </button>
      </form>
    </div>
  );
}
