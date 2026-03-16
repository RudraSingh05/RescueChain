import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await inventoryAPI.get("/my");
      setReservations(res.data);
    } catch (error) {
      alert("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <DashboardLayout>
    <h1 className="page-title">My Reservations</h1>
    {loading ? (
      <p className="loading-text">Loading...</p>
    ) : (
      <table className="supplier-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>Status</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.itemName}</td>
              <td>{r.quantity}</td>
              <td>{r.type}</td>
              <td>{r.status}</td>
              <td>{r.expiresAt ? new Date(r.expiresAt).toLocaleTimeString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </DashboardLayout>
  );
}