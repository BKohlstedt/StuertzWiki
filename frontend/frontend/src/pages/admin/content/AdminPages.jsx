import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      title
      isLocked
    }
  }
`;

const GET_PAGES = gql`
  query GetPages {
    departments {
      id
      title
      pages {
        id
        title
        slug
        imageUrl
        isLocked
      }
    }
  }
`;

const CREATE_PAGE = gql`
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      id
      title
      slug
      imageUrl
      isLocked
      department {
        id
        title
      }
    }
  }
`;

const UPDATE_PAGE = gql`
  mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
    updatePage(id: $id, input: $input) {
      id
      title
      slug
      imageUrl
      isLocked
    }
  }
`;

const DELETE_PAGE = gql`
  mutation DeletePage($id: ID!) {
    deletePage(id: $id)
  }
`;

export default function AdminPages() {
  const { loading, error, data, refetch } = useQuery(GET_PAGES);
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS);

  const [createPage] = useMutation(CREATE_PAGE);
  const [updatePage] = useMutation(UPDATE_PAGE);
  const [deletePage] = useMutation(DELETE_PAGE);

  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    imageUrl: "",
    departmentId: "",
    isLocked: false,
  });

  const [editingPage, setEditingPage] = useState(null);

  const handleCreate = async () => {
    if (!newPage.title.trim() || !newPage.slug.trim() || !newPage.departmentId) {
      return alert("Bitte Titel, Slug und Abteilung angeben.");
    }
    try {
      await createPage({
        variables: {
          input: {
            title: newPage.title.trim(),
            slug: newPage.slug.trim(),
            imageUrl: newPage.imageUrl.trim() || null,
            departmentId: Number(newPage.departmentId),
            isLocked: newPage.isLocked,
          },
        },
      });
      setNewPage({ title: "", slug: "", imageUrl: "", departmentId: "", isLocked: false });
      refetch();
    } catch (e) {
      alert("Fehler beim Erstellen: " + e.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingPage.title.trim() || !editingPage.slug.trim()) {
      return alert("Titel und Slug dürfen nicht leer sein.");
    }
    try {
      await updatePage({
        variables: {
          id: editingPage.id,
          input: {
            title: editingPage.title.trim(),
            slug: editingPage.slug.trim(),
            imageUrl: editingPage.imageUrl?.trim() || null,
            isLocked: editingPage.isLocked,
          },
        },
      });
      setEditingPage(null);
      refetch();
    } catch (e) {
      alert("Fehler beim Aktualisieren: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Seite wirklich löschen?")) return;
    try {
      await deletePage({ variables: { id } });
      refetch();
    } catch (e) {
      alert("Fehler beim Löschen: " + e.message);
    }
  };

  if (loading) return <p>Lade Seiten...</p>;
  if (error) return <p className="text-danger">Fehler: {error.message}</p>;

  return (
    <div>
      <h4>Neue Seite erstellen</h4>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Titel"
          className="form-control mb-2"
          value={newPage.title}
          onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Slug (z.B. meine-seite)"
          className="form-control mb-2"
          value={newPage.slug}
          onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bild URL (optional)"
          className="form-control mb-2"
          value={newPage.imageUrl}
          onChange={(e) => setNewPage({ ...newPage, imageUrl: e.target.value })}
        />
        <select
          className="form-select mb-2"
          value={newPage.departmentId}
          onChange={(e) => setNewPage({ ...newPage, departmentId: e.target.value })}
        >
          <option value="">Abteilung wählen</option>
          {departmentsData?.departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.title}
            </option>
          ))}
        </select>
        <div className="form-check mb-2">
          <input
            type="checkbox"
            id="newPageLocked"
            checked={newPage.isLocked}
            onChange={(e) => setNewPage({ ...newPage, isLocked: e.target.checked })}
            className="form-check-input"
          />
          <label htmlFor="newPageLocked" className="form-check-label">
            Gesperrt
          </label>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          Erstellen
        </button>
      </div>

      <hr />

      <h4>Seiten verwalten</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Slug</th>
            <th>Bild URL</th>
            <th>Gesperrt</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {data.departments.flatMap((dept) =>
            dept.pages.map((page) =>
              editingPage?.id === page.id ? (
                <tr key={page.id}>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editingPage.imageUrl || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, imageUrl: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={editingPage.isLocked}
                      onChange={(e) => setEditingPage({ ...editingPage, isLocked: e.target.checked })}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>
                      Speichern
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingPage(null)}>
                      Abbrechen
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td>{page.slug}</td>
                  <td>{page.imageUrl}</td>
                  <td>{page.isLocked ? "Ja" : "Nein"}</td>
                  <td>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => setEditingPage(page)}>
                      Bearbeiten
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(page.id)}>
                      Löschen
                    </button>
                  </td>
                </tr>
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
