import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await authAPI.get("/admin/users");
            setUsers(res.data);
        } catch {
            alert("Failed to load users");
        }
    };

    const blockUser = async (id) => {
        await authAPI.patch(`/admin/users/${id}/block`);
        fetchUsers();
    };

    const unblockUser = async (id) => {
        await authAPI.patch(`/admin/users/${id}/unblock`);
        fetchUsers();
    };

    const deleteUser = async (id) => {
        await authAPI.delete(`/admin/users/${id}`);
        fetchUsers();
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
                                    <button className="table-block-btn" onClick={() => blockUser(user.id)}>
                                        Block
                                    </button>
                                ) : (
                                    <button className="table-unblock-btn" onClick={() => unblockUser(user.id)}>
                                        Unblock
                                    </button>
                                )}

                                <button className="table-delete-btn" onClick={() => deleteUser(user.id)}>
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