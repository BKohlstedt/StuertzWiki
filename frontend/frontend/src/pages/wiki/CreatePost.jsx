// src/pages/wiki/CreatePost.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      content
      approved
    }
  }
`;

export default function CreatePost() {
  const { id: topicId } = useParams(); // Thema-ID aus URL
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // Array von { name, description }

  const [createPost, { loading, error }] = useMutation(CREATE_POST);

  // Datei-Upload Handler (nur lokal, keine Upload-API, Dateinamen simuliert)
  const handleAddFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles((prev) => [...prev, { name: file.name, description: "" }]);
    e.target.value = null; // reset input
  };

  const handleFileDescriptionChange = (index, desc) => {
    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, description: desc } : file))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Erstelle Array mit Dateinamen (hier nur Namen, keine echte Upload-URL)
    const fileNames = files.map((f) => f.name);

    try {
      await createPost({
        variables: {
          input: {
            topicId: Number(topicId),
            content,
            approved: false,
            files: fileNames,
            // falls dein Backend Titel + Kurzbeschreibung unterstützen soll,
            // müsstest du Input und Resolver entsprechend anpassen
          },
        },
      });

      // Nach Speichern zurück zur Topic-Seite oder Content-Verwaltung
      navigate(`/wiki/topic/${topicId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Neuen Beitrag erstellen</h2>
      <form onSubmit={handleSubmit}>
        <div className="d-flex">
          {/* Links 90% */}
          <div style={{ flex: "0 0 90%", paddingRight: "1rem" }}>
            <div className="mb-3">
              <label className="form-label">Titel</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Kurzbeschreibung (optional)</label>
              <textarea
                className="form-control"
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Inhalt</label>
              <textarea
                className="form-control"
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-danger">Fehler: {error.message}</p>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Speichert..." : "Beitrag erstellen"}
            </button>
          </div>

          {/* Rechts 10% */}
          <div style={{ flex: "0 0 10%", borderLeft: "1px solid #ccc", paddingLeft: "1rem" }}>
            <h5>Dateien</h5>
            <input type="file" onChange={handleAddFile} className="form-control mb-3" />

            {files.length === 0 && <p>Keine Dateien</p>}

            {files.map((file, index) => (
              <div key={index} className="mb-2">
                <strong>{file.name}</strong>
                <input
                  type="text"
                  className="form-control mt-1"
                  placeholder="Beschreibung (optional)"
                  value={file.description}
                  onChange={(e) => handleFileDescriptionChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
