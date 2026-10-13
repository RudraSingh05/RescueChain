
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  PageHeader,
  Panel,
  TableScroll,
  Status,
  Empty,
  Loading,
  Notice,
} from "../components/UI";
import { readable, formatDate } from "../utils/formatters";
import { inventoryAPI, errorMessage } from "../services/api";

export default function MyReservations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Manual refresh
  async function load() {
    setLoading(true);
    setError("");

    try {
      const r = await inventoryAPI.get("/user/my");
      setRows(r.data);
    } catch (e) {
      setError(errorMessage(e, "Unable to load reservations"));
    } finally {
      setLoading(false);
    }
  }

  // Initial reservations fetch
  useEffect(() => {
    let active = true;

    async function fetchReservations() {
      try {
        const r = await inventoryAPI.get("/user/my");

        if (active) {
          setRows(r.data);
        }
      } catch (e) {
        if (active) {
          setError(errorMessage(e, "Unable to load reservations"));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchReservations();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="YOUR REQUESTS"
        title="My reservations"
        description="Keep track of reserved supplies and their fulfillment status."
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

      <Panel
        title="Reservation history"
        subtitle={`${rows.length} reservations`}
      >
        {loading ? (
          <Loading />
        ) : rows.length ? (
          <TableScroll>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Fulfillment</th>
                <th>Status</th>
                <th>Expires at</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="primary-cell">{r.itemName}</td>
                  <td>{r.quantity}</td>
                  <td>{readable(r.type)}</td>
                  <td>
                    <Status value={r.status} />
                  </td>
                  <td>{formatDate(r.expiresAt)}</td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        ) : (
          <Empty
            title="No reservations yet"
            description="Find nearby supplies to make your first reservation."
          />
        )}
      </Panel>
    </DashboardLayout>
  );
}
