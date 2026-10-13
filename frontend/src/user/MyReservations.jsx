import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const res = await inventoryAPI.get("/user/my");
        setReservations(res.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
        alert("Failed to fetch reservations");
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
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
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.itemName}</td>
                <td>{reservation.quantity}</td>
                <td>{reservation.type}</td>
                <td>{reservation.status}</td>
                <td>
                  {reservation.expiresAt
                    ? new Date(
                        reservation.expiresAt,
                      ).toLocaleTimeString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
}