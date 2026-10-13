
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  PageHeader,
  Panel,
  TableScroll,
  Empty,
  Loading,
  Notice,
} from "../components/UI";
import { formatDate } from "../utils/formatters";
import { authAPI, errorMessage } from "../services/api";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Manual refresh
  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const r = await authAPI.get("/admin/logs");
      setLogs(r.data);
    } catch (e) {
      setError(errorMessage(e, "Unable to load activity"));
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    let active = true;

    const fetchLogs = async () => {
      try {
        const r = await authAPI.get("/admin/logs");

        if (active) {
          setLogs(r.data);
        }
      } catch (e) {
        if (active) {
          setError(errorMessage(e, "Unable to load activity"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLogs();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        title="Activity logs"
        eyebrow="AUDIT TRAIL"
        description="Review recent actions across the network."
        action={
          <button
            className="btn btn-secondary"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <Notice>{error}</Notice>

      <Panel title="Recent activity" subtitle="Recorded network events">
        {loading ? (
          <Loading />
        ) : logs.length ? (
          <TableScroll>
            <thead>
              <tr>
                <th>Action</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="primary-cell">{log.action}</td>
                  <td>{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        ) : (
          <Empty
            title="No activity yet"
            description="Network events will appear here."
          />
        )}
      </Panel>
    </DashboardLayout>
  );
}
