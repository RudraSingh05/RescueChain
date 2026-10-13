import { useEffect, useState } from "react";
import { Check, X, RefreshCw } from "lucide-react";
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
export default function SupplierApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await authAPI.get("/admin/supplier-applications");
      setApplications(r.data);
    } catch (e) {
      setError(errorMessage(e, "Unable to load applications"));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function decide(id, action) {
    if (
      action === "reject" &&
      !window.confirm("Reject this supplier application?")
    )
      return;
    setBusy(id);
    setError("");
    setSuccess("");
    try {
      await authAPI.post(`/admin/supplier-${action}/${id}`);
      setSuccess(
        `Application ${action === "approve" ? "approved" : "rejected"}.`,
      );
      await load();
    } catch (e) {
      setError(errorMessage(e, `Unable to ${action} application`));
    } finally {
      setBusy(null);
    }
  }
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="SUPPLIER NETWORK"
        title="Supplier applications"
        description="Review and manage organizations requesting access to the network."
        action={
          <button className="btn btn-secondary" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />
      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>
      <Panel
        title="Applications"
        subtitle={`${applications.length} submitted applications`}
      >
        {loading ? (
          <Loading />
        ) : applications.length ? (
          <TableScroll>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Category</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => (
                <tr key={a.id}>
                  <td className="primary-cell">{a.organizationName}</td>
                  <td>{readable(a.type)}</td>
                  <td>
                    <Status value={a.status} />
                  </td>
                  <td>
                    <div className="table-actions">
                      {a.status === "PENDING" ? (
                        <>
                          <button
                            className="btn btn-small btn-primary"
                            disabled={busy !== null}
                            onClick={() => decide(a.id, "approve")}
                          >
                            <Check size={15} /> Approve
                          </button>
                          <button
                            className="btn btn-small btn-secondary"
                            disabled={busy !== null}
                            onClick={() => decide(a.id, "reject")}
                          >
                            <X size={15} /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="muted">Reviewed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        ) : (
          <Empty
            title="No applications"
            description="New supplier requests will appear here."
          />
        )}
      </Panel>
    </DashboardLayout>
  );
}
