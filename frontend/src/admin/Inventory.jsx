import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

export default function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [lowStock, setLowStock] = useState([]);

    useEffect(() => {
        fetchInventory();
        fetchLowStock();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await authAPI.get("/admin/inventory");
            setInventory(res.data);
        } catch {
            alert("Failed to load inventory");
        }
    };

    const fetchLowStock = async () => {
        try {
            const res = await authAPI.get("/admin/inventory/low-stock");
            setLowStock(res.data);
        } catch {
            alert("Failed to load low stock");
        }
    };

    return (
        <DashboardLayout>
            <h1 className="page-title">Inventory Monitoring</h1>

            <div style={{ display: 'flex', gap:'2rem' }}>
                {/* 🔴 LOW STOCK ALERT */}
                <div style={{ flex:'1' }}>
                    <h2>Low Stock Alerts</h2>
                    <table className="supplier-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Supplier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStock.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.itemName}</td>
                                    <td style={{ color: "red" }}>{item.quantity}</td>
                                    <td>{item.supplier.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div  style={{ flex:'1' }}>
                    {/* 📦 ALL INVENTORY */}
                    <h2>All Inventory</h2>
                    <table className="supplier-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Supplier</th>
                                <th>Type</th>
                            </tr>
                        </thead>

                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.itemName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.supplier.name}</td>
                                    <td>{item.supplier.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}