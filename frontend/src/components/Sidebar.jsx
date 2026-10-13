
import { createElement } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  ClipboardList,
  Handshake,
  PackagePlus,
  Boxes,
  Truck,
  Users,
  UserRoundCheck,
  ScrollText,
  PackageSearch,
} from "lucide-react";

import useAuthStore from "../store/authStore";

const links = {
  USER: [
    ["/dashboard/user", "Overview", LayoutDashboard],
    ["/suppliers", "Find supplies", Search],
    ["/my-reservations", "My reservations", ClipboardList],
    ["/apply-supplier", "Become a supplier", Handshake],
  ],
  SUPPLIER: [
    ["/dashboard/supplier", "Overview", LayoutDashboard],
    ["/inventory", "Inventory", PackagePlus],
    ["/update-stock", "Update stock", Boxes],
    ["/supplier-reservations", "Reservations", Truck],
  ],
  ADMIN: [
    ["/dashboard/admin", "Overview", LayoutDashboard],
    ["/admin/supplier-applications", "Applications", UserRoundCheck],
    ["/admin/users", "Users", Users],
    ["/admin/inventory", "Inventory", PackageSearch],
    ["/admin/logs", "Activity logs", ScrollText],
  ],
};

export default function Sidebar({ onNavigate }) {
  const role = useAuthStore((s) => s.role);

  return (
    <>
      <div className="sidebar-heading">WORKSPACE</div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {(links[role] || []).map(([to, label, icon]) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            {createElement(icon, {
              size: 18,
              strokeWidth: 1.7,
            })}

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className="online-dot" />
        Emergency coordination network
      </div>
    </>
  );
}
