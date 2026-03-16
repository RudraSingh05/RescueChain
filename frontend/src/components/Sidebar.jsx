import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Sidebar() {
  const role = useAuthStore((state) => state.role);

  return (
    <div className="sidebar">
      {role === "USER" && (
        <>
          <Link className="sidebar-link" to="/dashboard/user">Dashboard</Link>
          <Link className="sidebar-link" to="/suppliers">Find Suppliers</Link>
          <Link className="sidebar-link" to="/my-reservations">My Reservations</Link>
          <Link className="sidebar-link" to="/apply-supplier">Become Supplier</Link>
        </>
      )}
      {role === "SUPPLIER" && (
        <>
          <Link className="sidebar-link" to="/dashboard/supplier">Dashboard</Link>
          <Link className="sidebar-link" to="/inventory">Add Inventory</Link>
          <Link className="sidebar-link" to="/update-stock">Update Stock</Link>
          <Link className="sidebar-link" to="/supplier-reservations">Reservations</Link>
        </>
      )}
      {role === "ADMIN" && (
        <>
          <Link className="sidebar-link" to="/admin/supplier-applications">Supplier Applications</Link>
        </>
      )}
    </div>
  );
}