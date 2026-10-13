import { useState } from "react";
import { X } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar, { Brand } from "../components/Navbar";
export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="shell">
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Brand />
          <button
            className="icon-btn sidebar-close"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <Sidebar onNavigate={() => setOpen(false)} />
      </aside>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="main-shell">
        <Navbar onMenu={() => setOpen(true)} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
