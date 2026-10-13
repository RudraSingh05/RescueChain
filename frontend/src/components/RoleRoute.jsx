import { Navigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
export default function RoleRoute({ role, children }) {
  const current = useAuthStore((s) => s.role);
  return current === role ? (
    children
  ) : (
    <Navigate
      to={
        current === "ADMIN"
          ? "/dashboard/admin"
          : current === "SUPPLIER"
            ? "/dashboard/supplier"
            : current === "USER"
              ? "/dashboard/user"
              : "/login"
      }
      replace
    />
  );
}
