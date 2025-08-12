// src/pages/admin/AdminPosts.jsx
import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    departments {
      id
      title
      pages {
        id
        title
        topics {
          id
          title
          posts {
            id
            title
            shortDescription
            content
            images
            approved
            createdAt
            updatedAt
            author {
              id
              email
            }
            files {
              id
              filename
              description
              url
            }
            topic {
              id
              title
              page {
                id
                title
                department {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default function AdminPosts() {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Lädt Beiträge...</p>;
  if (error) return <p className="text-danger">Fehler: {error.message}</p>;

  const posts = [];

  // Posts flach sammeln
  data.departments.forEach((dept) => {
    dept.pages.forEach((page) => {
      page.topics.forEach((topic) => {
        topic.posts.forEach((post) => {
          posts.push(post);
        });
      });
    });
  });

  return (
    <div className="container mt-5">
      <h2>Beiträge Verwaltung</h2>
      {posts.length === 0 ? (
        <p>Keine Beiträge gefunden.</p>
      ) : (
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Titel</th>
              <th>Kurzbeschreibung</th>
              <th>Autor</th>
              <th>Thema</th>
              <th>Seite</th>
              <th>Abteilung</th>
              <th>Freigegeben</th>
              <th>Dateien</th>
              <th>Erstellt am</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.shortDescription || <em>(keine)</em>}</td>
                <td>{post.author?.email || "–"}</td>
                <td>{post.topic?.title || "–"}</td>
                <td>{post.topic?.page?.title || "–"}</td>
                <td>{post.topic?.page?.department?.title || "–"}</td>
                <td>{post.approved ? "Ja" : "Nein"}</td>
                <td>
                  {post.files.length > 0 ? (
                    <ul className="mb-0">
                      {post.files.map((file) => (
                        <li key={file.id}>
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            {file.filename}
                          </a>
                          {file.description && ` – ${file.description}`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <em>Keine Dateien</em>
                  )}
                </td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
