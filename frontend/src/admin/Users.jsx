import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await authAPI.get("/admin/users");
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await authAPI.get("/admin/users");
        setUsers(res.data);
      } catch {
        alert("Failed to load users");
      }
    };

    loadUsers();
  }, []);

  const blockUser = async (id) => {
    try {
      await authAPI.patch(`/admin/users/${id}/block`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to block user:", error);
      alert("Failed to block user");
    }
  };

  const unblockUser = async (id) => {
    try {
      await authAPI.patch(`/admin/users/${id}/unblock`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to unblock user:", error);
      alert("Failed to unblock user");
    }
  };

  const deleteUser = async (id) => {
    try {
      await authAPI.delete(`/admin/users/${id}`);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Users Management</h1>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>

              <td>
                {user.status === "ACTIVE" ? (
                  <button
                    className="table-block-btn"
                    onClick={() => blockUser(user.id)}
                  >
                    Block
                  </button>
                ) : (
                  <button
                    className="table-unblock-btn"
                    onClick={() => unblockUser(user.id)}
                  >
                    Unblock
                  </button>
                )}

                <button
                  className="table-delete-btn"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}