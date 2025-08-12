import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_DEPARTMENTS_WITH_PAGES = gql`
  query GetDepartmentsWithPages {
    departments {
      id
      title
      pages {
        id
        title
        isLocked
      }
    }
  }
`;

const GET_TOPICS = gql`
  query GetTopics {
    departments {
      pages {
        topics {
          id
          title
          imageUrl
          isLocked
          page {
            id
            title
          }
        }
      }
    }
  }
`;

const CREATE_TOPIC = gql`
  mutation CreateTopic($input: CreateTopicInput!) {
    createTopic(input: $input) {
      id
      title
      imageUrl
      isLocked
      page {
        id
        title
      }
    }
  }
`;

const UPDATE_TOPIC = gql`
  mutation UpdateTopic($id: ID!, $input: UpdateTopicInput!) {
    updateTopic(id: $id, input: $input) {
      id
      title
      imageUrl
      isLocked
    }
  }
`;

const DELETE_TOPIC = gql`
  mutation DeleteTopic($id: ID!) {
    deleteTopic(id: $id)
  }
`;

export default function AdminTopics() {
  const { loading, error, data, refetch } = useQuery(GET_TOPICS);
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_WITH_PAGES);

  const [createTopic] = useMutation(CREATE_TOPIC);
  const [updateTopic] = useMutation(UPDATE_TOPIC);
  const [deleteTopic] = useMutation(DELETE_TOPIC);

  const [newTopic, setNewTopic] = useState({
    title: "",
    imageUrl: "",
    pageId: "",
    isLocked: false,
  });

  const [editingTopic, setEditingTopic] = useState(null);

  const handleCreate = async () => {
    if (!newTopic.title.trim() || !newTopic.pageId) {
      return alert("Bitte Titel und Seite angeben.");
    }
    try {
      await createTopic({
        variables: {
          input: {
            title: newTopic.title.trim(),
            imageUrl: newTopic.imageUrl.trim() || null,
            pageId: Number(newTopic.pageId),
            isLocked: newTopic.isLocked,
          },
        },
      });
      setNewTopic({ title: "", imageUrl: "", pageId: "", isLocked: false });
      refetch();
    } catch (e) {
      alert("Fehler beim Erstellen: " + e.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingTopic.title.trim()) {
      return alert("Titel darf nicht leer sein.");
    }
    try {
      await updateTopic({
        variables: {
          id: editingTopic.id,
          input: {
            title: editingTopic.title.trim(),
            imageUrl: editingTopic.imageUrl?.trim() || null,
            isLocked: editingTopic.isLocked,
          },
        },
      });
      setEditingTopic(null);
      refetch();
    } catch (e) {
      alert("Fehler beim Aktualisieren: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Thema wirklich löschen?")) return;
    try {
      await deleteTopic({ variables: { id } });
      refetch();
    } catch (e) {
      alert("Fehler beim Löschen: " + e.message);
    }
  };

  if (loading) return <p>Lade Themen...</p>;
  if (error) return <p className="text-danger">Fehler: {error.message}</p>;

  // Flatten Topics for easier rendering
  const topics = data.departments.flatMap((dept) =>
    dept.pages.flatMap((page) =>
      page.topics.map((topic) => ({ ...topic, page }))
    )
  );

  return (
    <div>
      <h4>Neues Thema erstellen</h4>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Titel"
          className="form-control mb-2"
          value={newTopic.title}
          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bild URL (optional)"
          className="form-control mb-2"
          value={newTopic.imageUrl}
          onChange={(e) => setNewTopic({ ...newTopic, imageUrl: e.target.value })}
        />
        <select
          className="form-select mb-2"
          value={newTopic.pageId}
          onChange={(e) => setNewTopic({ ...newTopic, pageId: e.target.value })}
        >
          <option value="">Seite wählen</option>
          {departmentsData?.departments.flatMap((dept) =>
            dept.pages.map((page) => (
              <option key={page.id} value={page.id}>
                {dept.title} / {page.title}
              </option>
            ))
          )}
        </select>
        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="newTopicLocked"
            checked={newTopic.isLocked}
            onChange={(e) => setNewTopic({ ...newTopic, isLocked: e.target.checked })}
            className="form-check-input"
          />
          <label htmlFor="newTopicLocked" className="form-check-label">
            Gesperrt
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          Erstellen
        </button>
      </div>

      <hr />

      <h4>Themen verwalten</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Seite</th>
            <th>Bild URL</th>
            <th>Gesperrt</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) =>
            editingTopic?.id === topic.id ? (
              <tr key={topic.id}>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editingTopic.title}
                    onChange={(e) => setEditingTopic({ ...editingTopic, title: e.target.value })}
                  />
                </td>
                <td>{topic.page.title}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editingTopic.imageUrl || ""}
                    onChange={(e) => setEditingTopic({ ...editingTopic, imageUrl: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={editingTopic.isLocked}
                    onChange={(e) => setEditingTopic({ ...editingTopic, isLocked: e.target.checked })}
                  />
                </td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>
                    Speichern
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingTopic(null)}>
                    Abbrechen
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={topic.id}>
                <td>{topic.title}</td>
                <td>{topic.page.title}</td>
                <td>{topic.imageUrl}</td>
                <td>{topic.isLocked ? "Ja" : "Nein"}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => setEditingTopic(topic)}>
                    Bearbeiten
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(topic.id)}>
                    Löschen
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
