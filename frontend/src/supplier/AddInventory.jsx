import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function AddInventory() {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  const [inventory, setInventory] = useState([]);

  const handleAdd = async () => {
    try {
      await inventoryAPI.post("/supplier/add", {
        itemName,
        quantity
      });

      alert("Inventory added");

      setItemName("");
      setQuantity("");

      fetchInventory();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add inventory");
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await inventoryAPI.get("/supplier/my");
      setInventory(res.data);
    } catch (error) {
      console.error("Failed to fetch inventory");
    }
  };

  return (
    <DashboardLayout>
      <div className="supplier-layout">

      <div className="supplier-left">
        <h1 className="page-title">Add Inventory</h1>
        <div className="form-card">
          <input className="form-input" placeholder="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} />
          <input className="form-input" type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          <button className="form-btn" onClick={handleAdd}>Add Inventory</button>
        </div>
      </div>

      <div className="supplier-right">
        <h2 className="page-title">My Inventory</h2>

        <table className="supplier-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="2">No inventory added</td>
              </tr>
            ) : (
              inventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

            </div>
    </DashboardLayout>
  );
}