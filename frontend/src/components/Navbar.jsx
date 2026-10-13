import { LogOut, Menu, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
export function Brand() {
  return (
    <div className="brand">
      <div className="brand-mark">
        <ShieldCheck size={20} strokeWidth={1.8} />
      </div>
      <span>
        rescue<span className="brand-light">chain</span>
        <small>SUPPLY NETWORK</small>
      </span>
    </div>
  );
}
export default function Navbar({ onMenu }) {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <button
        className="icon-btn menu-trigger"
        aria-label="Open navigation"
        onClick={onMenu}
      >
        <Menu size={21} />
      </button>
      <div className="topbar-title">Emergency supply coordination</div>
      <div className="topbar-actions">
        <span className="role-chip">{role?.toLowerCase()}</span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut size={16} />
          <span className="logout-label">Sign out</span>
        </button>
      </div>
    </header>
  );
}
