import React from "react";
import { useQuery, gql } from "@apollo/client";
import WikiLayout from "../../components/WikiLayout";
import "./WikiStartseite.css";

const GET_DEPARTMENTS = gql`
  query {
    departments {
      id
      title
      imageUrl
    }
  }
`;

export default function WikiStartseite() {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);

  if (loading) return <p>Lade Abteilungen...</p>;
  if (error) return <p>Fehler beim Laden der Abteilungen: {error.message}</p>;

  const departments = data.departments;

  return (
    <WikiLayout>
      <div className="department-grid">
        {departments.map((dept) => (
          <a
            key={dept.id}
            href={`/wiki/department/${dept.id}`}
            className="department-tile"
            tabIndex={0}
          >
            <div className="tile-title">{dept.title}</div>
            <div
              className="tile-image"
              style={{
                backgroundImage: `url(${dept.imageUrl || "/images/placeholder.png"})`,
              }}
              aria-label={`Bild der Abteilung ${dept.title}`}
              role="img"
            />
          </a>
        ))}
      </div>
    </WikiLayout>
  );
}
