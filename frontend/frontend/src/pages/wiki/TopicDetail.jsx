// src/pages/wiki/TopicDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_TOPIC = gql`
  query GetTopic($id: ID!) {
    topic(id: $id) {
      id
      title
      page {
        departmentId
      }
      posts {
        id
        title
        shortDescription
        content
        files {
          filename
          description
        }
        approved
      }
    }
  }
`;

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file)
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
    }
  }
`;

export default function TopicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_TOPIC, { variables: { id } });

  const [uploadFile] = useMutation(UPLOAD_FILE);
  const [createPost] = useMutation(CREATE_POST);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // { file: File, description: string, uploadedPath: string }

  if (loading) return <p>Lade Thema...</p>;
  if (error) return <p className="text-danger">Fehler: {error.message}</p>;

  const handleFileChange = (e) => {
    const fileObjs = Array.from(e.target.files).map((file) => ({
      file,
      description: "",
      uploadedPath: null,
    }));
    setFiles((prev) => [...prev, ...fileObjs]);
  };

  const handleDescriptionChange = (index, desc) => {
    const newFiles = [...files];
    newFiles[index].description = desc;
    setFiles(newFiles);
  };

  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const uploadAllFiles = async () => {
    const uploadedFiles = [];
    for (const f of files) {
      if (!f.uploadedPath) {
        const { data } = await uploadFile({ variables: { file: f.file } });
        uploadedFiles.push({
          filename: data.uploadFile,
          description: f.description,
        });
      } else {
        uploadedFiles.push({
          filename: f.uploadedPath,
          description: f.description,
        });
      }
    }
    return uploadedFiles;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedFiles = await uploadAllFiles();

      await createPost({
        variables: {
          input: {
            topicId: Number(id),
            title,
            shortDescription,
            content,
            images: [],
            files: uploadedFiles,
            approved: false,
          },
        },
      });

      alert("Beitrag erstellt und wartet auf Freigabe.");
      navigate("/wiki/department/" + data.topic.page.departmentId);
    } catch (err) {
      alert("Fehler beim Erstellen des Beitrags: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{data.topic.title}</h2>

      <form onSubmit={handleSubmit} className="row">
        <div className="col-8">
          <div className="mb-3">
            <label className="form-label">Titel *</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Kurzbeschreibung</label>
            <textarea
              className="form-control"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              rows={2}
              maxLength={500}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Inhalt *</label>
            <textarea
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Beitrag erstellen
          </button>
        </div>

        <div className="col-4">
          <label className="form-label" htmlFor="fileInput">
            Dateien hinzufügen
          </label>
          <div style={{ width: "100%" }}>
            <input
              id="fileInput"
              type="file"
              multiple
              onChange={handleFileChange}
              className="form-control mb-3"
              style={{
                display: "block",
                width: "100%",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            />
          </div>

          {files.length > 0 && (
            <div>
              <h5>Dateien</h5>
              {files.map((f, i) => (
                <div key={i} className="mb-3 border p-2 rounded">
                  <div>
                    <strong>{f.file.name}</strong> ({(f.file.size / 1024).toFixed(1)} KB)
                  </div>
                  <input
                    type="text"
                    placeholder="Beschreibung (optional)"
                    className="form-control mt-1 w-100"
                    value={f.description}
                    onChange={(e) => handleDescriptionChange(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-1"
                    onClick={() => handleRemoveFile(i)}
                  >
                    Entfernen
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
