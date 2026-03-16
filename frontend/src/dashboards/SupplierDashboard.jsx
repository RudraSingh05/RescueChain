import DashboardLayout from "../layout/DashboardLayout";

export default function SupplierDashboard() {
  return (
    <DashboardLayout>
      <h1 className="page-title">Supplier Dashboard</h1>
      <div className="cards">
        <div className="card">Manage Inventory</div>
        <div className="card">Update Stock</div>
        <div className="card">View Reservations</div>
      </div>
    </DashboardLayout>
  );
}