import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
export default function ActionCards({ items }) {
  return (
    <div className="action-grid">
      {items.map(({ to, title, description, icon: Icon }) => (
        <Link className="action-tile" to={to} key={to}>
          <span className="tile-icon">
            <Icon size={21} strokeWidth={1.6} />
          </span>
          <ArrowUpRight className="tile-arrow" size={18} />
          <h3>{title}</h3>
          <p>{description}</p>
        </Link>
      ))}
    </div>
  );
}
