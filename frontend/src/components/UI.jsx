import { AlertCircle, CheckCircle2, LoaderCircle, Inbox } from "lucide-react";
export function PageHeader({
  eyebrow = "WORKSPACE",
  title,
  description,
  action,
}) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}
export function Panel({ title, subtitle, action, children, className = "" }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Notice({ type = "error", children }) {
  return children ? (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`notice notice-${type}`}
    >
      {type === "error" ? (
        <AlertCircle size={17} />
      ) : (
        <CheckCircle2 size={17} />
      )}
      <span>{children}</span>
    </div>
  ) : null;
}
export function Empty({
  title = "Nothing here yet",
  description = "Records will appear here when available.",
}) {
  return (
    <div className="empty">
      <Inbox size={25} strokeWidth={1.5} />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
export function Loading({ label = "Loading data" }) {
  return (
    <div className="loading" role="status">
      <LoaderCircle size={19} className="spin" />
      {label}
    </div>
  );
}
export function Status({ value }) {
  const v = String(value || "UNKNOWN");
  return (
    <span
      className={`status status-${v.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
    >
      <span className="status-dot" />
      {v.replaceAll("_", " ")}
    </span>
  );
}
export function TableScroll({ children }) {
  return (
    <div className="table-scroll">
      <table className="data-table">{children}</table>
    </div>
  );
}
export function formatDate(value) {
  return value
    ? new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";
}
export function readable(value) {
  return String(value || "—").replaceAll("_", " ");
}
