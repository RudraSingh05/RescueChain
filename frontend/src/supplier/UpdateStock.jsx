import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";

export default function UpdateStock() {
  const [inventory, setInventory] = useState([]);
  const [updateValues, setUpdateValues] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await inventoryAPI.get("/supplier/my");
    setInventory(res.data);
  };

  const updateStock = async (itemName, quantity) => {
    await inventoryAPI.patch("/supplier/update", {
      itemName,
      quantity
    });

    setUpdateValues((prev) => ({
      ...prev,
      [itemName]: ""
    }));
     alert("Inventory Updated");

    fetchInventory();
  };

  const handleInputChange = (itemName, value) => {
    setUpdateValues({
      ...updateValues,
      [itemName]: value
    });
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">Update Stock</h1>
      <div className="cards">
        {inventory.map((item) => (
          <div key={item.id} className="card">

            <p className="card-item-name">{item.itemName}</p>

            <p className="card-item-qty">
              Current Quantity: {item.quantity}
            </p>

            <input
              type="number"
              className="form-input"
              placeholder="Add quantity"
              value={updateValues[item.itemName] || ""}
              onChange={(e) =>
                handleInputChange(item.itemName, e.target.value)
              }
            />

            <button
              className="card-btn"
              disabled={!updateValues[item.itemName]}
              onClick={() =>
                updateStock(
                  item.itemName,
                  item.quantity + Number(updateValues[item.itemName] || 0)
                )
              }
            >
              Update Stock
            </button>

          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}