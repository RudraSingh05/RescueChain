import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const role = useAuthStore((state) => state.role);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <h2 className="navbar-title">Emergency Supply Chain</h2>
      <div className="nav-right">
        <span className="nav-role">{role}</span>
        <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}