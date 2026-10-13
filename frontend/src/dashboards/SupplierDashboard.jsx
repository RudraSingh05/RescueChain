import { PackagePlus, Boxes, Truck, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import ActionCards from "../components/ActionCards";
import { PageHeader } from "../components/UI";
export default function SupplierDashboard() {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="SUPPLIER WORKSPACE"
        title="Supply operations"
        description="Maintain accurate availability and coordinate every incoming request."
      />
      <section className="hero-panel">
        <div>
          <span className="hero-kicker">SUPPLIER OPERATIONS</span>
          <h2>
            Preparedness starts
            <br />
            with visibility.
          </h2>
          <p>
            Keep your inventory current so critical supplies can be found when
            needed.
          </p>
          <Link className="btn btn-light" to="/inventory">
            Manage inventory <ArrowRight size={17} />
          </Link>
        </div>
        <div className="hero-decoration" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
        </div>
      </section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">OPERATIONS</p>
          <h2>Your workspace</h2>
        </div>
      </div>
      <ActionCards
        items={[
          {
            to: "/inventory",
            title: "Add inventory",
            description: "Publish essential items and current quantities.",
            icon: PackagePlus,
          },
          {
            to: "/update-stock",
            title: "Update stock",
            description: "Adjust availability as supplies change.",
            icon: Boxes,
          },
          {
            to: "/supplier-reservations",
            title: "Reservations",
            description: "Review pickup and delivery requests.",
            icon: Truck,
          },
        ]}
      />
    </DashboardLayout>
  );
}
