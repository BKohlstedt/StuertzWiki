import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user } = useAuth();

  const tiles = [
    {
      title: "Benutzerverwaltung",
      path: "/admin/users",
      image: "/images/users.png",
      colorClass: "bg-primary text-white",
    },
    {
      title: "Content Verwaltung",
      path: "/admin/content",
      image: "/images/content.png",
      colorClass: "bg-success text-white",
    },
    {
      title: "User Einladung",
      path: "/admin/invite",
      image: "/images/invite.png",
      colorClass: "bg-warning text-dark",
    },
    {
      title: "Berechtigungen",
      path: "/admin/permissions",
      image: "/images/permissions.png",
      colorClass: "bg-danger text-white",
    },
    {
      title: "Übersicht",
      path: "/admin/overview",
      image: "/images/overview.png",
      colorClass: "bg-info text-white",
    },
  ];

  const handleImageError = (e) => {
    e.target.src = "/images/placeholder.png";
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4" style={{ fontSize: "1.8rem" }}>
        Willkommen im Administrationsbereich
      </h2>

      <div className="row justify-content-center mt-4">
        {tiles.map((tile, index) => (
          <div key={index} className="col-md-3 m-3">
            <Link to={tile.path} className="text-decoration-none">
              <div className="card shadow-sm h-100">
                <img
                  src={tile.image}
                  onError={handleImageError}
                  className="card-img-top"
                  alt={`${tile.title} Bild`}
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <div
                  className={`card-body d-flex align-items-center justify-content-center ${tile.colorClass}`}
                  style={{ height: "70px" }}
                >
                  <h5 className="card-title m-0">{tile.title}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
