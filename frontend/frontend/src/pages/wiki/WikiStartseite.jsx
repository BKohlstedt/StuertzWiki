import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      title
      imageUrl
    }
  }
`;

const PLACEHOLDER_IMG = "/assets/placeholder.png";

export default function WikiStartseite() {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);

  if (loading) return <p>Lade Abteilungen...</p>;
  if (error) return <p className="text-danger">Fehler beim Laden der Abteilungen: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h1>Wiki Startseite</h1>
      <div className="row mt-4">
        {data.departments.map(({ id, title, imageUrl }) => {
          const imgSrc = imageUrl || PLACEHOLDER_IMG;
          console.log(imageUrl);

          return (
            <div key={id} className="col-md-3 mb-4">
              <Link to={`/wiki/department/${id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm">
                  <div className="card-header bg-primary text-white text-center fw-bold">
                    {title}
                  </div>
                  <img
                    src={imgSrc}
                    alt={title}
                    className="card-img-bottom"
                    style={{ height: "180px", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
