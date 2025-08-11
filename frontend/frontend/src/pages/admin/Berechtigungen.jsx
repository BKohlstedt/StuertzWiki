import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function Berechtigungen() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await api.get("/roles-permissions");
      setRoles(res.data.roles);
      setPermissions(res.data.allPermissions);
    } catch (err) {
      console.error("Fehler beim Laden:", err);
    }
  };

  const handleCheckboxChange = (roleId, permissionKey) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === roleId
          ? {
              ...role,
              permissions: role.permissions.includes(permissionKey)
                ? role.permissions.filter((p) => p !== permissionKey)
                : [...role.permissions, permissionKey],
            }
          : role
      )
    );
  };

  const savePermissions = async (roleId, permissions) => {
    try {
      await api.put(`/roles/${roleId}/permissions`, { permissions });
      alert("Berechtigungen gespeichert");
    } catch (err) {
      console.error(err);
    }
  };

  const createRole = async () => {
    if (!newRole.trim()) return;

    try {
      await api.post("/roles", { name: newRole.trim() });
      setNewRole("");
      loadRoles();
    } catch (err) {
      console.error("Fehler beim Erstellen der Rolle:", err);
      alert(err.response?.data?.message || "Fehler beim Erstellen der Rolle");
    }
  };

  const deleteRole = async (id, roleName) => {
    const confirmed = window.confirm(
      `Möchtest du die Rolle "${roleName}" wirklich löschen?`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/roles/${id}`);
      loadRoles();
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message.includes("wird im System verwendet")
      ) {
        alert(err.response.data.message);
      } else {
        alert("Fehler beim Löschen der Rolle");
      }
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Berechtigungen verwalten</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Rolle</th>
            {permissions.map((perm) => (
              <th key={perm.id}>{perm.description}</th>
            ))}
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              {permissions.map((perm) => (
                <td key={perm.id} className="text-center">
                  <input
                    type="checkbox"
                    checked={role.permissions.includes(perm.key)}
                    onChange={() => handleCheckboxChange(role.id, perm.key)}
                  />
                </td>
              ))}
              <td>
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => savePermissions(role.id, role.permissions)}
                >
                  Speichern
                </button>
                {!["admin", "superuser", "user"].includes(role.name) && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteRole(role.id, role.name)}
                  >
                    Löschen
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h5>Neue Rolle erstellen</h5>
        <div className="d-flex">
          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="form-control me-2"
            placeholder="Rollenname"
          />
          <button className="btn btn-primary" onClick={createRole}>
            Erstellen
          </button>
        </div>
      </div>
    </div>
  );
}
