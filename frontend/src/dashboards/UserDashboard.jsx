import DashboardLayout from "../layout/DashboardLayout";
import { Link } from "react-router-dom";


export default function UserDashboard() {
    return (
        <DashboardLayout>
            <h1 className="page-title">User Dashboard</h1>
            <div className="cards">
                <Link className="sidebar-link" to="/suppliers"><div className="card">Find Nearby Suppliers</div></Link>
                <Link className="sidebar-link" to="/my-reservations"><div className="card">Track Reservations</div></Link>
                <Link className="sidebar-link" to="/apply-supplier"><div className="card">Become Supplier</div></Link>
            </div>
        </DashboardLayout>
    )
}