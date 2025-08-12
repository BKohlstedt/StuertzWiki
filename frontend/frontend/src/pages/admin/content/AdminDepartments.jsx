import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_DEPARTMENTS = gql`
  query GetDepartments($isLocked: Boolean) {
    departments(isLocked: $isLocked) {
      id
      title
      imageUrl
      isLocked
      createdAt
      updatedAt
    }
  }
`;

const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      title
      isLocked
      imageUrl
    }
  }
`;

const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($id: ID!, $input: UpdateDepartmentInput!) {
    updateDepartment(id: $id, input: $input) {
      id
      title
      isLocked
      imageUrl
    }
  }
`;

const DELETE_DEPARTMENT = gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id)
  }
`;

export default function AdminDepartments() {
  // Filterstatus: null = alle, true = gesperrt, false = freigegeben
  const [filterLocked, setFilterLocked] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [newDept, setNewDept] = useState({ title: "", imageUrl: "", isLocked: false });

  const { loading, error, data, refetch } = useQuery(GET_DEPARTMENTS, {
    variables: { isLocked: filterLocked },
  });

  const [createDepartment] = useMutation(CREATE_DEPARTMENT);
  const [updateDepartment] = useMutation(UPDATE_DEPARTMENT);
  const [deleteDepartment] = useMutation(DELETE_DEPARTMENT);

  const handleCreate = async () => {
    if (!newDept.title.trim()) {
      alert("Titel darf nicht leer sein.");
      return;
    }
    try {
      await createDepartment({ variables: { input: newDept } });
      setNewDept({ title: "", imageUrl: "", isLocked: false });
      refetch();
    } catch (e) {
      alert("Fehler beim Erstellen: " + e.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingDept.title.trim()) {
      alert("Titel darf nicht leer sein.");
      return;
    }
    try {
      await updateDepartment({
        variables: { id: editingDept.id, input: {
          title: editingDept.title,
          imageUrl: editingDept.imageUrl,
          isLocked: editingDept.isLocked,
        }},
      });
      setEditingDept(null);
      refetch();
    } catch (e) {
      alert("Fehler beim Aktualisieren: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Abteilung wirklich löschen?")) return;
    try {
      await deleteDepartment({ variables: { id } });
      refetch();
    } catch (e) {
      alert("Fehler beim Löschen: " + e.message);
    }
  };

  if (loading) return <p>Lade Abteilungen...</p>;
  if (error) return <p className="text-danger">Fehler: {error.message}</p>;

  return (
    <div className="container mt-4">
      <h3>Abteilungsverwaltung</h3>

      {/* Filter Buttons */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${filterLocked === null ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilterLocked(null)}
          type="button"
        >
          Alle
        </button>
        <button
          className={`btn me-2 ${filterLocked === false ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilterLocked(false)}
          type="button"
        >
          Freigegeben
        </button>
        <button
          className={`btn ${filterLocked === true ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFilterLocked(true)}
          type="button"
        >
          Gesperrt
        </button>
      </div>

      {/* Neue Abteilung erstellen */}
      <div className="mb-4">
        <h5>Neue Abteilung erstellen</h5>
        <input
          type="text"
          placeholder="Titel"
          className="form-control mb-2"
          value={newDept.title}
          onChange={(e) => setNewDept({ ...newDept, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Bild-URL"
          className="form-control mb-2"
          value={newDept.imageUrl}
          onChange={(e) => setNewDept({ ...newDept, imageUrl: e.target.value })}
        />
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            id="newDeptLock"
            className="form-check-input"
            checked={newDept.isLocked === true}
            onChange={() => setNewDept({ ...newDept, isLocked: true })}
          />
          <label htmlFor="newDeptLock" className="form-check-label">
            Sperren
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            type="checkbox"
            id="newDeptUnlock"
            className="form-check-input"
            checked={newDept.isLocked === false}
            onChange={() => setNewDept({ ...newDept, isLocked: false })}
          />
          <label htmlFor="newDeptUnlock" className="form-check-label">
            Freigeben
          </label>
        </div>
        <br />
        <button className="btn btn-primary mt-3" onClick={handleCreate}>
          Erstellen
        </button>
      </div>

      <hr />

      {/* Tabelle der Abteilungen */}
      <h4>Abteilungen verwalten</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Titel</th>
            <th>Bild URL</th>
            <th>Gesperrt</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {data.departments.map((dept) =>
            editingDept?.id === dept.id ? (
              <tr key={dept.id}>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editingDept.title}
                    onChange={(e) => setEditingDept({ ...editingDept, title: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editingDept.imageUrl || ""}
                    onChange={(e) => setEditingDept({ ...editingDept, imageUrl: e.target.value })}
                  />
                </td>
                <td>
                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      id={`lock-${editingDept.id}`}
                      className="form-check-input"
                      checked={editingDept.isLocked === true}
                      onChange={() => setEditingDept({ ...editingDept, isLocked: true })}
                    />
                    <label htmlFor={`lock-${editingDept.id}`} className="form-check-label">
                      Sperren
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      type="checkbox"
                      id={`unlock-${editingDept.id}`}
                      className="form-check-input"
                      checked={editingDept.isLocked === false}
                      onChange={() => setEditingDept({ ...editingDept, isLocked: false })}
                    />
                    <label htmlFor={`unlock-${editingDept.id}`} className="form-check-label">
                      Freigeben
                    </label>
                  </div>
                </td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>
                    Speichern
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingDept(null)}>
                    Abbrechen
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={dept.id}>
                <td>{dept.title}</td>
                <td>{dept.imageUrl}</td>
                <td>{dept.isLocked ? "Ja" : "Nein"}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => setEditingDept(dept)}>
                    Bearbeiten
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dept.id)}>
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
