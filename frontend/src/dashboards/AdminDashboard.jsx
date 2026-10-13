import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Clock3,
  ArrowRight,
  UserRoundCheck,
  PackageSearch,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import ActionCards from "../components/ActionCards";
import { PageHeader, Notice } from "../components/UI";
import { authAPI, errorMessage } from "../services/api";
export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    authAPI
      .get("/admin/stats")
      .then((r) => setStats(r.data))
      .catch((e) => setError(errorMessage(e, "Unable to load statistics")));
  }, []);
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Network overview"
        description="A clear view of people, suppliers, and pending approvals."
      />
      <Notice>{error}</Notice>
      <div className="stat-grid">
        {[
          [Users, "Total users", stats.users],
          [Building2, "Active suppliers", stats.suppliers],
          [Clock3, "Pending applications", stats.pending],
        ].map(([Icon, label, value]) => (
          <div className="stat-card" key={label}>
            <span className="stat-icon">
              <Icon size={21} />
            </span>
            <span className="stat-label">{label}</span>
            <strong>{value ?? "—"}</strong>
          </div>
        ))}
      </div>
      <div className="section-heading">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h2>Network administration</h2>
        </div>
        <Link className="text-link" to="/admin/supplier-applications">
          Review applications <ArrowRight size={16} />
        </Link>
      </div>
      <ActionCards
        items={[
          {
            to: "/admin/supplier-applications",
            title: "Supplier applications",
            description: "Review organizations requesting access.",
            icon: UserRoundCheck,
          },
          {
            to: "/admin/inventory",
            title: "Inventory oversight",
            description: "Monitor stock and shortages across the network.",
            icon: PackageSearch,
          },
          {
            to: "/admin/logs",
            title: "Activity logs",
            description: "Review recent system activity.",
            icon: ScrollText,
          },
        ]}
      />
    </DashboardLayout>
  );
}
