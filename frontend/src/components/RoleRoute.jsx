import useAuthStore from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ role, children }) {
    const userRole = useAuthStore((state) => state.role);

    if (userRole !== role) {
        return <Navigate to="/" />;
    }

    return children;
}