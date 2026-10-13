import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../src/auth/Login";
import Register from "../src/auth/Register";
import UserDashboard from "../src/dashboards/UserDashboard";
import SupplierDashboard from "../src/dashboards/SupplierDashboard";
import AdminDashboard from "../src/dashboards/AdminDashboard";
import FindSuppliers from "../src/user/FindSuppliers";
import MyReservations from "../src/user/MyReservations";
import ApplySupplier from "../src/user/ApplySupplier";
import AddInventory from "../src/supplier/AddInventory";
import UpdateStock from "../src/supplier/UpdateStock";
import SupplierReservations from "../src/supplier/SupplierReservations";
import SupplierApplications from "../src/admin/SupplierApplications";
import ActivityLogs from "../src/admin/ActivityLogs";
import Users from "../src/admin/Users";
import Inventory from "../src/admin/Inventory";
import ProtectedRoute from "../src/components/ProtectedRoute";
import RoleRoute from "../src/components/RoleRoute";
import useAuthStore from "../src/store/authStore";
function HomeRedirect() {
  const role = useAuthStore((s) => s.role);
  return (
    <Navigate
      replace
      to={
        role === "ADMIN"
          ? "/dashboard/admin"
          : role === "SUPPLIER"
            ? "/dashboard/supplier"
            : role === "USER"
              ? "/dashboard/user"
              : "/login"
      }
    />
  );
}
const secured = (page, role) => (
  <ProtectedRoute>
    {role ? <RoleRoute role={role}>{page}</RoleRoute> : page}
  </ProtectedRoute>
);
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard/user"
          element={secured(<UserDashboard />, "USER")}
        />
        <Route
          path="/dashboard/supplier"
          element={secured(<SupplierDashboard />, "SUPPLIER")}
        />
        <Route
          path="/dashboard/admin"
          element={secured(<AdminDashboard />, "ADMIN")}
        />
        <Route path="/suppliers" element={secured(<FindSuppliers />, "USER")} />
        <Route
          path="/my-reservations"
          element={secured(<MyReservations />, "USER")}
        />
        <Route
          path="/apply-supplier"
          element={secured(<ApplySupplier />, "USER")}
        />
        <Route
          path="/inventory"
          element={secured(<AddInventory />, "SUPPLIER")}
        />
        <Route
          path="/update-stock"
          element={secured(<UpdateStock />, "SUPPLIER")}
        />
        <Route
          path="/supplier-reservations"
          element={secured(<SupplierReservations />, "SUPPLIER")}
        />
        <Route
          path="/admin/supplier-applications"
          element={secured(<SupplierApplications />, "ADMIN")}
        />
        <Route
          path="/admin/logs"
          element={secured(<ActivityLogs />, "ADMIN")}
        />
        <Route path="/admin/users" element={secured(<Users />, "ADMIN")} />
        <Route
          path="/admin/inventory"
          element={secured(<Inventory />, "ADMIN")}
        />
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
