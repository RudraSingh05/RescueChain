import DashboardLayout from "../layout/DashboardLayout";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="cards">
        <div className="card">Supplier Applications</div>
      </div>
    </DashboardLayout>
  );
}