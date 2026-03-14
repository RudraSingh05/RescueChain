import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function AddInventory() {

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAdd = async () => {

    try {

      await inventoryAPI.post("/inventory/add", {
        itemName,
        quantity
      });

      alert("Inventory added");

      setItemName("");
      setQuantity("");

    } catch (error) {
      alert(error.response?.data?.error || "Failed to add inventory");
    }

  };

  return (

    <DashboardLayout>

      <h1>Add Inventory</h1>

      <div className="form">

        <input
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <button onClick={handleAdd}>
          Add Inventory
        </button>

      </div>

    </DashboardLayout>

  );
}