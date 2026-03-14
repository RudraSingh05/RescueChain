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

      <h1>Supplier Reservations</h1>

      {reservations.map((r) => (

        <div key={r.id} className="card">

          <p>Item: {r.itemName}</p>
          <p>Quantity: {r.quantity}</p>
          <p>Status: {r.status}</p>
          <p>Type: {r.type}</p>

        </div>

      ))}

    </DashboardLayout>

  );
}