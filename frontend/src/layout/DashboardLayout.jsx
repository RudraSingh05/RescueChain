import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {

  return (
    <div className="dashboard-container">

      <Navbar />

      <div className="dashboard-body">

        <Sidebar />

        <div className="dashboard-content">
          {children}
        </div>

      </div>

    </div>
  );
}