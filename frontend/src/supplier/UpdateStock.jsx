import { useEffect, useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { PageHeader, Panel, Empty, Loading, Notice } from "../components/UI";
import { inventoryAPI, errorMessage } from "../services/api";
export default function UpdateStock() {
  const [items, setItems] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function load() {
    setLoading(true);
    try {
      const r = await inventoryAPI.get("/supplier/my");
      setItems(r.data);
    } catch (e) {
      setError(errorMessage(e, "Unable to load inventory"));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function update(item) {
    const amount = Number(values[item.id]);
    if (!Number.isInteger(amount) || amount <= 0) {
      setError("Enter a positive whole-number quantity.");
      return;
    }
    setBusy(item.id);
    setError("");
    setSuccess("");
    try {
      await inventoryAPI.patch("/supplier/update", {
        itemName: item.itemName,
        quantity: Number(item.quantity) + amount,
      });
      setValues((v) => ({ ...v, [item.id]: "" }));
      setSuccess(`${item.itemName} updated.`);
      await load();
    } catch (e) {
      setError(errorMessage(e, "Unable to update stock"));
    } finally {
      setBusy(null);
    }
  }
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="SUPPLIER OPERATIONS"
        title="Update stock"
        description="Add received units to your currently available quantities."
        action={
          <button className="btn btn-secondary" onClick={load}>
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />
      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>
      {loading ? (
        <Loading />
      ) : items.length ? (
        <div className="stock-grid">
          {items.map((item) => (
            <Panel
              key={item.id}
              title={item.itemName}
              subtitle="Current availability"
            >
              <div className="stock-count">
                {item.quantity}
                <span>units available</span>
              </div>
              <label className="field">
                <span>Additional units</span>
                <input
                  min="1"
                  step="1"
                  type="number"
                  value={values[item.id] ?? ""}
                  placeholder="Enter quantity to add"
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [item.id]: e.target.value }))
                  }
                />
              </label>
              <button
                className="btn btn-primary btn-full"
                disabled={busy !== null || !values[item.id]}
                onClick={() => update(item)}
              >
                <Plus size={16} />
                {busy === item.id ? "Updating…" : "Add stock"}
              </button>
            </Panel>
          ))}
        </div>
      ) : (
        <Empty
          title="No inventory found"
          description="Add inventory before updating quantities."
        />
      )}
    </DashboardLayout>
  );
}
