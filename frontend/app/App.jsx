import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./App.css"
import "./My.css"

import Login from "../src/auth/Login";
import Register from "../src/auth/Register";

import UserDashboard from "../src/dashboards/UserDashboard";
import SupplierDashboard from "../src/dashboards/SupplierDashboard";
import AdminDashboard from "../src/dashboards/AdminDashboard";

//user pages
import FindSuppliers from "../src/user/FindSuppliers";
import MyReservations from "../src/user/MyReservations";
import ApplySupplier from "../src/user/ApplySupplier";

//Supplier pages
import AddInventory from "../src/supplier/AddInventory";
import UpdateStock from "../src/supplier/UpdateStock";
import SupplierReservations from "../src/supplier/SupplierReservations";

//Admin pages
import SupplierApplications from "../src/admin/SupplierApplications";
import ActivityLogs from "../src/admin/ActivityLogs";
import Users from "../src/admin/Users";
import Inventory from "../src/admin/Inventory";

import ProtectedRoute from "../src/components/ProtectedRoute";
import RoleRoute from "../src/components/RoleRoute";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard/user"
          element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <UserDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/supplier"
          element={
            <ProtectedRoute>
              <RoleRoute role="SUPPLIER">
                <SupplierDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <FindSuppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-reservations"
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <RoleRoute role="SUPPLIER">
                <AddInventory />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/update-stock"
          element={
            <ProtectedRoute>
              <RoleRoute role="SUPPLIER">
                <UpdateStock />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/supplier-reservations"
          element={
            <ProtectedRoute>
              <RoleRoute role="SUPPLIER">
                <SupplierReservations />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply-supplier"
          element={
            <ProtectedRoute>
              <RoleRoute role="USER">
                <ApplySupplier />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <AdminDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/supplier-applications"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <SupplierApplications />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <ActivityLogs />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <Users />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/inventory"
          element={
            <ProtectedRoute>
              <RoleRoute role="ADMIN">
                <Inventory />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );

}

export default App;