import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { useEffect, useState } from "react";
import { authAPI } from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await authAPI.get("/admin/stats");
      setStats(res.data);
    } catch {
      alert("Failed to load stats");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="cards">
        <div className="card cards">Total Users : {stats.users}</div>
        <div className="card cards">Total Suppliers : {stats.suppliers}</div>
        <div className="card cards">Pending Applications : {stats.pending}</div>
        <div className="cards">
          <Link to="/admin/supplier-applications">
            <div className="card action-card">Manage Supplier Applications</div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}