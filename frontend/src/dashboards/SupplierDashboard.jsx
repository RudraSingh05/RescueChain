import DashboardLayout from "../layout/DashboardLayout";
import { Link } from "react-router-dom";


export default function SupplierDashboard() {
  return (
    <DashboardLayout>
      <h1 className="page-title">Supplier Dashboard</h1>
      <div className="cards">
        <Link className="sidebar-link" to="/inventory"><div className="card">Manage Inventory</div></Link>
        <Link className="sidebar-link" to="/update-stock"><div className="card">Update Stock</div></Link>
        <Link className="sidebar-link" to="/supplier-reservations"><div className="card">View Reservations</div></Link>
      </div>
    </DashboardLayout>
  );
}