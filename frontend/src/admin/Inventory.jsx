
import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  PageHeader,
  Panel,
  TableScroll,
  Empty,
  Loading,
  Notice,
  readable,
} from "../components/UI";
import { authAPI, errorMessage } from "../services/api";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Manual refresh
  async function load() {
    setLoading(true);
    setError("");

    try {
      const [all, low] = await Promise.all([
        authAPI.get("/admin/inventory"),
        authAPI.get("/admin/inventory/low-stock"),
      ]);

      setInventory(all.data);
      setLowStock(low.data);
    } catch (e) {
      setError(errorMessage(e, "Unable to load inventory"));
    } finally {
      setLoading(false);
    }
  }

  // Initial data fetch
  useEffect(() => {
    let active = true;

    async function fetchInventory() {
      try {
        const [all, low] = await Promise.all([
          authAPI.get("/admin/inventory"),
          authAPI.get("/admin/inventory/low-stock"),
        ]);

        if (active) {
          setInventory(all.data);
          setLowStock(low.data);
        }
      } catch (e) {
        if (active) {
          setError(errorMessage(e, "Unable to load inventory"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchInventory();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="NETWORK INVENTORY"
        title="Inventory oversight"
        description="Monitor supply availability and identify stock that needs attention."
        action={
          <button
            className="btn btn-secondary"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={16} /> Refresh
          </button>
        }
      />

      <Notice>{error}</Notice>

      <div className="two-panels">
        <Panel
          title="Low stock alerts"
          subtitle="Items requiring attention"
          action={<AlertTriangle size={19} className="warning-icon" />}
        >
          {loading ? (
            <Loading />
          ) : lowStock.length ? (
            <TableScroll>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Available</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((item) => (
                  <tr key={item.id}>
                    <td className="primary-cell">{item.itemName}</td>
                    <td>
                      <span className="low-qty">{item.quantity}</span>
                    </td>
                    <td>{item.supplier?.name || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          ) : (
            <Empty
              title="No low-stock alerts"
              description="All monitored items are above the alert threshold."
            />
          )}
        </Panel>

        <Panel title="All inventory" subtitle="Supplies across the network">
          {loading ? (
            <Loading />
          ) : inventory.length ? (
            <TableScroll>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Supplier</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="primary-cell">{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.supplier?.name || "—"}</td>
                    <td>{readable(item.supplier?.type)}</td>
                  </tr>
                ))}
              </tbody>
            </TableScroll>
          ) : (
            <Empty title="No inventory yet" />
          )}
        </Panel>
      </div>
    </DashboardLayout>
  );
}
