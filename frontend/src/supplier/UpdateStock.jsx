import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function UpdateStock() {

  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {

    const res = await inventoryAPI.get("/inventory/my");

    setInventory(res.data);
  };

  const updateStock = async (itemName, quantity) => {

    await inventoryAPI.patch("/inventory/update", {
      itemName,
      quantity
    });

    fetchInventory();
  };

  return (

    <DashboardLayout>

      <h1>Update Stock</h1>

      {inventory.map((item) => (

        <div key={item.id} className="card">

          <p>{item.itemName}</p>
          <p>Quantity: {item.quantity}</p>

          <button
            onClick={() => updateStock(item.itemName, item.quantity + 10)}
          >
            Add 10
          </button>

        </div>

      ))}

    </DashboardLayout>

  );
}