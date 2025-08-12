// src/pages/wiki/PageDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";

const GET_PAGE = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      title
      slug
      department {
        id
        title
      }
      topics {
        id
        title
      }
    }
  }
`;

export default function PageDetail() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PAGE, {
    variables: { id },
  });

  if (loading) return <p>Lade Seite...</p>;
  if (error) return <p className="text-danger">Fehler beim Laden der Seite.</p>;

  const { page } = data;

  return (
    <>
      <nav className="mb-3">
        <Link to={`/wiki/department/${page.department.id}`} className="btn btn-link me-3">
          &larr; Zurück zur Abteilung {page.department.title}
        </Link>
        <Link to="/wiki" className="btn btn-link">
          &larr; Zurück zur Wiki-Startseite
        </Link>
      </nav>

      <h2>{page.title}</h2>

      <h4 className="mt-4">Themen</h4>
      {page.topics.length === 0 && <p>Keine Themen vorhanden.</p>}
      <div className="list-group">
        {page.topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/wiki/topic/${topic.id}`}
            className="list-group-item list-group-item-action"
          >
            {topic.title}
          </Link>
        ))}
      </div>
    </>
  );
}
