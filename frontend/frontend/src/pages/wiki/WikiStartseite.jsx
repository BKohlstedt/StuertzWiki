// src/pages/wiki/WikiStartseite.jsx
import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import WikiNavbar from "../../components/WikiNavbar";

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      title
      imageUrl
      isLocked
    }
  }
`;

export default function WikiStartseite() {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (data?.departments) {
      setDepartments(data.departments);
    }
  }, [data]);

  if (loading) return <p>Lade Abteilungen...</p>;
  if (error) return <p>Fehler beim Laden der Abteilungen.</p>;

  return (
    <>
      <WikiNavbar />
      <div className="container mt-4">
        <div className="row">
          {departments.map((dept) => (
            <div key={dept.id} className="col-md-3 mb-4">
              <Link to={`/wiki/department/${dept.id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm">
                  <div
                    className="card-header text-white"
                    style={{ backgroundColor: "#007bff", fontWeight: "bold" }}
                  >
                    {dept.title}
                  </div>
                  <img
                    src={dept.imageUrl || "/images/placeholder.png"}
                    alt={`${dept.title} Bild`}
                    className="card-img-bottom"
                    style={{ height: "150px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
