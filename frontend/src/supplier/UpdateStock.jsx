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
      <h1 className="page-title">Update Stock</h1>
      <div className="cards">
        {inventory.map((item) => (
          <div key={item.id} className="card">
            <p className="card-item-name">{item.itemName}</p>
            <p className="card-item-qty">Quantity: {item.quantity}</p>
            <button className="card-btn" onClick={() => updateStock(item.itemName, item.quantity + 10)}>Add 10</button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}