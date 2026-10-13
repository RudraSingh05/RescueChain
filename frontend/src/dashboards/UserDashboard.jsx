import { Search, ClipboardList, Handshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import ActionCards from "../components/ActionCards";
import { PageHeader } from "../components/UI";
export default function UserDashboard() {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="PERSONAL WORKSPACE"
        title="Your emergency supply hub"
        description="Find essential supplies, coordinate reservations, and stay informed from one calm workspace."
      />
      <section className="hero-panel">
        <div>
          <span className="hero-kicker">RESCUECHAIN NETWORK</span>
          <h2>
            Essential supplies.
            <br />
            Closer when it matters.
          </h2>
          <p>
            Search available inventory from nearby verified suppliers and
            reserve what you need.
          </p>
          <Link className="btn btn-light" to="/suppliers">
            Find available supplies <ArrowRight size={17} />
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
          <p className="eyebrow">QUICK ACCESS</p>
          <h2>What would you like to do?</h2>
        </div>
      </div>
      <ActionCards
        items={[
          {
            to: "/suppliers",
            title: "Find suppliers",
            description: "Discover nearby oxygen, blood, medicine and more.",
            icon: Search,
          },
          {
            to: "/my-reservations",
            title: "My reservations",
            description: "Track the status and expiry of your requests.",
            icon: ClipboardList,
          },
          {
            to: "/apply-supplier",
            title: "Become a supplier",
            description: "Join the network and help your community.",
            icon: Handshake,
          },
        ]}
      />
    </DashboardLayout>
  );
}
