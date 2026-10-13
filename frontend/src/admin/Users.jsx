
import { useEffect, useState } from "react";
import { Ban, CheckCircle2, Trash2, RefreshCw } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  PageHeader,
  Panel,
  TableScroll,
  Status,
  Empty,
  Loading,
  Notice,
  readable,
} from "../components/UI";
import { authAPI, errorMessage } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Manual refresh and reload after admin actions
  async function load() {
    setLoading(true);
    setError("");

    try {
      const r = await authAPI.get("/admin/users");
      setUsers(r.data);
    } catch (e) {
      setError(errorMessage(e, "Unable to load users"));
    } finally {
      setLoading(false);
    }
  }

  // Initial fetch on mount
  useEffect(() => {
    let active = true;

    async function fetchUsers() {
      try {
        const r = await authAPI.get("/admin/users");

        if (active) {
          setUsers(r.data);
        }
      } catch (e) {
        if (active) {
          setError(errorMessage(e, "Unable to load users"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchUsers();

    return () => {
      active = false;
    };
  }, []);

  // Block, unblock, or delete user
  async function act(user, action) {
    const message =
      action === "delete"
        ? "Permanently delete"
        : action === "block"
          ? "Block"
          : "Unblock";

    if (!window.confirm(`${message} ${user.name}?`)) {
      return;
    }

    setBusy(user.id);
    setError("");
    setSuccess("");

    try {
      if (action === "delete") {
        await authAPI.delete(`/admin/users/${user.id}`);
      } else {
        await authAPI.patch(`/admin/users/${user.id}/${action}`);
      }

      setSuccess(
        `User ${
          action === "delete"
            ? "deleted"
            : action === "block"
              ? "blocked"
              : "unblocked"
        }.`,
      );

      await load();
    } catch (e) {
      setError(errorMessage(e, "Unable to update user"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="ACCESS CONTROL"
        title="User management"
        description="Manage network accounts, roles, and access status."
        action={
          <button
            className="btn btn-secondary"
            onClick={load}
            disabled={loading || busy !== null}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />

      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>

      <Panel
        title="Network users"
        subtitle={`${users.length} registered accounts`}
      >
        {loading ? (
          <Loading />
        ) : users.length ? (
          <TableScroll>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="primary-cell">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{readable(user.role)}</td>
                  <td>
                    <Status value={user.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-small btn-secondary"
                        disabled={busy !== null || loading}
                        onClick={() =>
                          act(
                            user,
                            user.status === "ACTIVE" ? "block" : "unblock",
                          )
                        }
                      >
                        {user.status === "ACTIVE" ? (
                          <Ban size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}{" "}
                        {user.status === "ACTIVE" ? "Block" : "Unblock"}
                      </button>

                      <button
                        className="btn btn-small btn-danger"
                        disabled={busy !== null || loading}
                        onClick={() => act(user, "delete")}
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        ) : (
          <Empty title="No users found" />
        )}
      </Panel>
    </DashboardLayout>
  );
}
