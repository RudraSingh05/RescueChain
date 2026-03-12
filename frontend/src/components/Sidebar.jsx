import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Sidebar() {

  const role = useAuthStore((state) => state.role);

  return (
    <div className="sidebar">

      {role === "USER" && (
        <>
          <Link to="/dashboard/user">Dashboard</Link>
          <Link to="/suppliers">Find Suppliers</Link>
          <Link to="/reserve">Reserve Resource</Link>
          <Link to="/my-reservations">My Reservations</Link>
        </>
      )}

      {role === "SUPPLIER" && (
        <>
          <Link to="/dashboard/supplier">Dashboard</Link>
          <Link to="/inventory">Add Inventory</Link>
          <Link to="/update-stock">Update Stock</Link>
          <Link to="/supplier-reservations">Reservations</Link>
        </>
      )}

    </div>
  );
}