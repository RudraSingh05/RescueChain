import { useState, useEffect } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { inventoryAPI } from "../services/api";
import useAuthStore from "../store/authStore";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMapEvents,
    useMap
} from "react-leaflet";
import L from "leaflet";


const supplierIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

function FitRouteBounds({ route }) {
    const map = useMap();
    if (route.length > 0) {
        map.fitBounds(route, {
            padding: [50, 50],
            animate: true,
            duration: 1.5
        });
    }
    return null;
}


export default function FindSuppliers() {
    const userId = useAuthStore((state) => state.userId);

    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [requestType, setRequestType] = useState("PICKUP");

    const [route, setRoute] = useState([]);

    const fetchRoute = async (userLat, userLng, supplierLat, supplierLng) => {
        try {
            const res = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${supplierLng},${supplierLat}?overview=full&geometries=geojson`
            );
            const data = await res.json();
            const coordinates = data.routes[0].geometry.coordinates.map((coord) => [
                coord[1],
                coord[0],
            ]);
            setRoute(coordinates);
        } catch (error) {
            console.error("Route fetch failed", error);
        }
    };

    // AUTO DETECT USER LOCATION
    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLatitude(lat);
            setLongitude(lon);
        });
    }, []);

    // Auto zoom map when location changes
    function ChangeMapView({ center }) {
        const map = useMap();
        map.setView(center, 17);
        return null;
    }

    // MAP CLICK LOCATION
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setLatitude(e.latlng.lat);
                setLongitude(e.latlng.lng);
            }
        });
        if (!latitude || !longitude) return null;
        return <Marker position={[latitude, longitude]} />;
    }

    // MANUAL LOCATION BUTTON
    const useMyLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    };

    const handleSearch = async (e) => {
        try {
            e.preventDefault();
            if (!latitude || !longitude) {
                alert("Please select location on map");
                return;
            }
            setLoading(true);
            const res = await inventoryAPI.get("/user/suppliers/nearest", {
                params: {
                    itemName,
                    quantity,
                    latitude,
                    longitude
                }
            });
            setSuppliers(res.data);
            if (res.data.length > 0) {
                const nearest = res.data[0];
                fetchRoute(
                    latitude,
                    longitude,
                    nearest.latitude,
                    nearest.longitude
                );
            }
        } catch (error) {
            alert(error.response?.data?.error || "Failed to fetch suppliers");
        } finally {
            setLoading(false);
        }
    };

    const handleReserve = async () => {
        try {
            await inventoryAPI.post("/user/reserve", {
                supplierId: selectedSupplier.id,
                itemName,
                quantity: Number(quantity),
                requestType,
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
            <h1 className="page-title">Find Nearest Suppliers</h1>

            <div className="side-by-side">
                <form onSubmit={handleSearch} className="form-card">
                        <input
                            className="search-input"
                            placeholder="Item Name (Oxygen, Blood, Medicine)"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                        <input
                            className="search-input"
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />

                    <div className="form-btn-group">
                        <button type="button" className="form-btn-secondary" onClick={useMyLocation}>
                            Use My Location
                        </button>
                        <button className="form-btn" type="submit">
                            {loading ? "Searching..." : "Find Suppliers"}
                        </button>
                    </div>
                </form>

                {/* MAP */}
                <div className="map-container">
                    <MapContainer
                        center={latitude && longitude ? [latitude, longitude] : [20.5937, 78.9629]}
                        zoom={latitude ? 13 : 5}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                        {latitude && longitude && route.length === 0 && (
                            <ChangeMapView center={[latitude, longitude]} />
                        )}

                        <LocationMarker />

                        {suppliers
                            .filter((supplier) => supplier.latitude && supplier.longitude)
                            .map((supplier) => (
                                <Marker
                                    key={supplier.id}
                                    position={[supplier.latitude, supplier.longitude]}
                                    icon={supplierIcon}
                                >
                                    <Popup>
                                        <strong>{supplier.name}</strong><br />
                                        Type: {supplier.type}<br />
                                        Distance: {Number(supplier.distance).toFixed(2)} km<br />
                                        Available: {supplier.availableQuantity}
                                        <br /><br />
                                        <button
                                            className="table-reserve-btn"
                                            onClick={() => {
                                                setSelectedSupplier(supplier);
                                                setShowModal(true);
                                            }}
                                        >
                                            Reserve
                                        </button>
                                    </Popup>
                                </Marker>
                            ))}

                        {route.length > 0 && (
                            <Polyline positions={route} color="blue" weight={5} />
                        )}

                        {route.length > 0 && <FitRouteBounds route={route} />}

                    </MapContainer>
                </div>
            </div>

            {/* SUPPLIER TABLE */}
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
                            <td>{Number(supplier.distance).toFixed(2)} km</td>
                            <td>{supplier.availableQuantity}</td>
                            <td>
                                <button
                                    className="table-reserve-btn"
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
                        <h3 className="modal-title">Select Request Type</h3>

                        <label className="modal-radio-label">
                            <input
                                type="radio"
                                value="PICKUP"
                                checked={requestType === "PICKUP"}
                                onChange={(e) => setRequestType(e.target.value)}
                            />
                            Pickup
                        </label>

                        <label className="modal-radio-label">
                            <input
                                type="radio"
                                value="DELIVERY"
                                checked={requestType === "DELIVERY"}
                                onChange={(e) => setRequestType(e.target.value)}
                            />
                            Delivery
                        </label>

                        <div className="modal-actions">
                            <button className="modal-confirm-btn" onClick={handleReserve}>
                                Confirm Reservation
                            </button>
                            <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}