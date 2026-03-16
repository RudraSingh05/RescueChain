import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

export default function SupplierApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await authAPI.get("/admin/supplier-applications");
      setApplications(res.data);
    } catch (error) {
      alert("Failed to fetch applications");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const approve = async (id) => {
    try {
      await authAPI.post(`/admin/supplier-approve/${id}`);
      alert("Supplier approved");
      fetchApplications();
    } catch (error) {
      alert("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await authAPI.post(`/admin/supplier-reject/${id}`);
      alert("Supplier rejected");
      fetchApplications();
    } catch (error) {
      alert("Rejection failed");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Supplier Applications</h1>
      <table className="supplier-table">
        <thead>
          <tr>
            <th>Organization</th>
            <th>Type</th>
            <th>Status</th>
            <th>Approve</th>
            <th>Reject</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.organizationName}</td>
              <td>{app.type}</td>
              <td>{app.status}</td>
              <td>
                <button className="table-approve-btn" onClick={() => approve(app.id)}>Approve</button>
              </td>
              <td>
                <button className="table-reject-btn" onClick={() => reject(app.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}