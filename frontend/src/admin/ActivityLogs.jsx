import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await authAPI.get("/admin/logs");
      setLogs(res.data);
    } catch {
      alert("Failed to load logs");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Activity Logs</h1>

      <table className="supplier-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.action}</td>
              <td>{new Date(log.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}