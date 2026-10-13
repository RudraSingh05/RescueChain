import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();
  return token ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
