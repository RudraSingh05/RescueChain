import DashboardLayout from "../layout/DashboardLayout";

export default function UserDashboard() {
    return (
        <DashboardLayout>
            <h1 className="page-title">User Dashboard</h1>
            <div className="cards">
                <div className="card">Find Nearby Suppliers</div>
                <div className="card">Reserve Emergency Supplies</div>
                <div className="card">Track Reservations</div>
            </div>
        </DashboardLayout>
    )
}