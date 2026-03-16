import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function SupplierReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const res = await inventoryAPI.get("/supplier/reservations");
    setReservations(res.data);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Supplier Reservations</h1>
      <div className="cards">
        {reservations.map((r) => (
          <div key={r.id} className="card">
            <p className="card-detail">Item: {r.itemName}</p>
            <p className="card-detail">Quantity: {r.quantity}</p>
            <p className="card-detail">Status: {r.status}</p>
            <p className="card-detail">Type: {r.type}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}