import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  PageHeader,
  Panel,
  TableScroll,
  Empty,
  Loading,
  Notice,
} from "../components/UI";
import { inventoryAPI, errorMessage } from "../services/api";
export default function AddInventory() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
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
  async function submit(e) {
    e.preventDefault();
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setError("Enter a positive whole-number quantity.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await inventoryAPI.post("/supplier/add", {
        itemName: itemName.trim(),
        quantity: Number(quantity),
      });
      setItemName("");
      setQuantity("");
      setSuccess("Inventory added successfully.");
      await load();
    } catch (e) {
      setError(errorMessage(e, "Unable to add inventory"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="SUPPLIER OPERATIONS"
        title="Manage inventory"
        description="Keep your available emergency supplies accurate and up to date."
      />
      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>
      <div className="form-data-grid">
        <Panel
          title="Add a supply item"
          subtitle="Publish availability to the network"
        >
          <form onSubmit={submit} className="form-stack">
            <label className="field">
              <span>Item name</span>
              <input
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Oxygen cylinder"
              />
            </label>
            <label className="field">
              <span>Quantity available</span>
              <input
                required
                min="1"
                step="1"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              <Plus size={17} />
              {busy ? "Adding item…" : "Add to inventory"}
            </button>
          </form>
        </Panel>
        <Panel
          title="Current inventory"
          subtitle={`${items.length} listed items`}
          action={
            <button
              className="icon-btn"
              aria-label="Refresh inventory"
              onClick={load}
            >
              <RefreshCw size={17} />
            </button>
          }
        >
          {loading ? (
            <Loading />
          ) : items.length ? (
            <TableScroll>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Available quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="primary-cell">{item.itemName}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          ) : (
            <Empty
              title="No inventory listed"
              description="Add your first item using the form."
            />
          )}
        </Panel>
      </div>
    </DashboardLayout>
  );
}
