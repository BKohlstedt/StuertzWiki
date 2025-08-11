import React from "react";
import { useQuery, gql } from "@apollo/client";
import WikiLayout from "../../components/WikiLayout";

const GET_DEPARTMENTS = gql`
  query {
    departments {
      id
      title
      imageUrl
    }
  }
`;

const placeholderImage = "/images/placeholder.png";

export default function WikiStartseite() {
  const { loading, error, data } = useQuery(GET_DEPARTMENTS);

  if (loading) return <p>Lade Abteilungen...</p>;
  if (error) return <p>Fehler beim Laden der Abteilungen: {error.message}</p>;

  return (
    <WikiLayout>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          padding: "1rem 2rem",
          justifyContent: "center",
        }}
      >
        {data.departments.map(({ id, title, imageUrl }) => (
          <a
            key={id}
            href={`/wiki/department/${id}`}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 2px 5px rgb(0 0 0 / 0.1)",
            }}
          >
            <div
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "0.5rem 1rem",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {title}
            </div>
            <div
              style={{
                backgroundImage: `url(${imageUrl || placeholderImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexGrow: 1,
                minHeight: "120px",
              }}
              aria-label={`Bild der Abteilung ${title}`}
              role="img"
            />
          </a>
        ))}
      </div>
    </WikiLayout>
  );
}
