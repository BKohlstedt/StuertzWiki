// src/pages/wiki/DepartmentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import WikiNavbar from "../../components/WikiNavbar";

const GET_DEPARTMENT = gql`
  query GetDepartment($id: ID!) {
    department(id: $id) {
      id
      title
      imageUrl
      isLocked
      pages {
        id
        title
        slug
      }
    }
  }
`;

export default function DepartmentDetail() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_DEPARTMENT, {
    variables: { id },
  });

  if (loading) return <p>Lade Abteilung...</p>;
  if (error) return <p>Fehler beim Laden der Abteilung.</p>;

  const { department } = data;

  return (
    <>
      <WikiNavbar />
      <div className="container mt-4">
        <h2>{department.title}</h2>
        <div className="row">
          {department.pages.length === 0 && <p>Keine Seiten vorhanden.</p>}
          {department.pages.map((page) => (
            <div key={page.id} className="col-md-4 mb-3">
              <Link
                to={`/wiki/page/${page.id}`}
                className="btn btn-outline-primary w-100"
              >
                {page.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
