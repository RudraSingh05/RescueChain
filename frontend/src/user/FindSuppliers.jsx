import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";
import useAuthStore from "../store/authStore";

export default function FindSuppliers() {
    const userId = useAuthStore((state) => state.userId);
    console.log(userId)
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reserving, setReserving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [requestType, setRequestType] = useState("PICKUP");

    const handleSearch = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);

            const res = await inventoryAPI.get("/suppliers/nearest", {
                params: {
                    itemName,
                    quantity,
                    latitude,
                    longitude
                }
            });

            setSuppliers(res.data);

        } catch (error) {
            alert("Failed to fetch suppliers");
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async () => {
        try {

            await inventoryAPI.post("/reserve", {
                supplierId: selectedSupplier.id,
                itemName,
                quantity: Number(quantity),
                requestType: requestType,
                userId
            });
            console.log({
                supplierId: selectedSupplier.id,
                itemName,
                quantity,
                requestType: requestType,
                userId
            });
            alert("Reservation successful");
            setShowModal(false);

        } catch (error) {
            alert(error.response?.data?.error || "Reservation failed");
        }
    };

    return (
        <DashboardLayout>

            <h1>Find Nearest Suppliers</h1>

            <form onSubmit={handleSearch} className="search-form">

                <input
                    placeholder="Item Name (Oxygen, Blood, Medicine)"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />

                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />

                <input
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    required
                />

                <input
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    required
                />

                <button type="submit">
                    {loading ? "Searching..." : "Find Suppliers"}
                </button>

            </form>

            <table className="supplier-table">

                <thead>
                    <tr>
                        <th>Supplier</th>
                        <th>Type</th>
                        <th>Distance (km)</th>
                        <th>Available</th>
                        <th>Reserve</th>
                    </tr>
                </thead>

                <tbody>

                    {suppliers.map((supplier) => (

                        <tr key={supplier.id}>

                            <td>{supplier.name}</td>

                            <td>{supplier.type}</td>

                            <td>{supplier.distance}</td>

                            <td>{supplier.availableQuantity}</td>

                            <td>
                                <button
                                    onClick={() => {
                                        setSelectedSupplier(supplier);
                                        setShowModal(true);
                                    }}
                                >
                                    Reserve
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
            {showModal && (

                <div className="modal-overlay">

                    <div className="modal">

                        <h3>Select Request Type</h3>

                        <label>
                            <input
                                type="radio"
                                name="requestType"
                                value="PICKUP"
                                checked={requestType === "PICKUP"}
                                onChange={(e) => setRequestType(e.target.value)}
                            />
                            Pickup
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="requestType"
                                value="DELIVERY"
                                checked={requestType === "DELIVERY"}
                                onChange={(e) => setRequestType(e.target.value)}
                            />
                            Delivery
                        </label>

                        <div className="modal-actions">

                            <button onClick={handleReserve}>
                                Confirm Reservation
                            </button>

                            <button onClick={() => setShowModal(false)}>
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </DashboardLayout>
    );
}