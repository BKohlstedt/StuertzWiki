import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";


export default function Benutzerverwaltung() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleChanges, setRoleChanges] = useState({});

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

   const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Benutzer:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data);
    } catch (err) {
      console.error("Fehler beim Laden der Rollen:", err);
    }
  };

 const handleRoleChange = (userId, newRoleId) => {
    setRoleChanges({ ...roleChanges, [userId]: newRoleId });
  };

  const handleSave = async (userId) => {
    const roleId = roleChanges[userId];
    if (!roleId) return;

    try {
      await api.put(`/users/${userId}`, { roleId });
      await fetchUsers();
      const updatedChanges = { ...roleChanges };
      delete updatedChanges[userId];
      setRoleChanges(updatedChanges);
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Benutzers:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Benutzerverwaltung</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Email-Adresse</th>
            <th>Zugewiesene Rolle</th>
            <th>Berechtigungen</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  className="form-select"
                  value={roleChanges[user.id] || user.role.id}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                {user.role?.permissions?.length > 0 ? (
                  <ul className="mb-0">
                    {user.role.permissions.map((rp) => (
                      <li key={rp.permission.id}>
                        {rp.permission.description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <em>Keine Berechtigungen</em>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleSave(user.id)}
                  disabled={!roleChanges[user.id]}
                >
                  Speichern
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
