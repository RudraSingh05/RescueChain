import DashboardLayout from "../layout/DashboardLayout";

export default function SupplierDashboard() {

    return (

        <DashboardLayout>

            <h1>Supplier Control Panel</h1>

            <div className="cards">

                <div className="card">
                    Add Inventory
                </div>

                <div className="card">
                    Update Stock
                </div>

                <div className="card">
                    View Reservations
                </div>

            </div>

        </DashboardLayout>

    )

}