import { useEffect, useState } from "react";
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
  useMap,
} from "react-leaflet";

import L from "leaflet";

const supplierIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Automatically move map to selected user location
function ChangeMapView({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 17);
  }, [map, latitude, longitude]);

  return null;
}

// Allow user to manually select location on map
function LocationMarker({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

  if (latitude === null || longitude === null) {
    return null;
  }

  return <Marker position={[latitude, longitude]} />;
}

// Fit map around calculated route
function FitRouteBounds({ route }) {
  const map = useMap();

  useEffect(() => {
    if (route.length > 0) {
      map.fitBounds(route, {
        padding: [50, 50],
        animate: true,
        duration: 1.5,
      });
    }
  }, [map, route]);

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

  const fetchRoute = async (
    userLat,
    userLng,
    supplierLat,
    supplierLng,
  ) => {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${supplierLng},${supplierLat}?overview=full&geometries=geojson`,
      );

      if (!res.ok) {
        throw new Error(`Route request failed: ${res.status}`);
      }

      const data = await res.json();

      if (!data.routes || data.routes.length === 0) {
        setRoute([]);
        return;
      }

      const coordinates = data.routes[0].geometry.coordinates.map(
        (coord) => [coord[1], coord[0]],
      );

      setRoute(coordinates);
    } catch (error) {
      console.error("Route fetch failed:", error);
      setRoute([]);
    }
  };

  // Automatically detect user's location on page load
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Automatic location detection failed:", error);
      },
    );
  }, []);

  // Manual location button
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        // Remove previous route when user location changes
        setRoute([]);
      },
      (error) => {
        console.error("Failed to detect location:", error);
        alert("Unable to detect your location");
      },
    );
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (latitude === null || longitude === null) {
      alert("Please select location on map");
      return;
    }

    try {
      setLoading(true);
      setRoute([]);

      const res = await inventoryAPI.get(
        "/user/suppliers/nearest",
        {
          params: {
            itemName,
            quantity,
            latitude,
            longitude,
          },
        },
      );

      setSuppliers(res.data);

      if (res.data.length > 0) {
        const nearest = res.data[0];

        await fetchRoute(
          latitude,
          longitude,
          nearest.latitude,
          nearest.longitude,
        );
      }
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Failed to fetch suppliers",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!selectedSupplier) {
      alert("Please select a supplier");
      return;
    }

    try {
      await inventoryAPI.post("/user/reserve", {
        supplierId: selectedSupplier.id,
        itemName,
        quantity: Number(quantity),
        requestType,
        userId,
      });

      alert("Reservation successful");

      setShowModal(false);
      setSelectedSupplier(null);
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Reservation failed",
      );
    }
  };

  const openReservationModal = (supplier) => {
    setSelectedSupplier(supplier);
    setShowModal(true);
  };

  const closeReservationModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  return (
    <DashboardLayout>
      <h1 className="page-title">
        Find Nearest Suppliers
      </h1>

      <div className="side-by-side">
        <form
          onSubmit={handleSearch}
          className="form-card"
        >
          <input
            className="search-input"
            placeholder="Item Name (Oxygen, Blood, Medicine)"
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value)
            }
            required
          />

          <input
            className="search-input"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            required
          />

          <div className="form-btn-group">
            <button
              type="button"
              className="form-btn-secondary"
              onClick={useMyLocation}
            >
              Use My Location
            </button>

            <button
              className="form-btn"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Find Suppliers"}
            </button>
          </div>
        </form>

        {/* MAP */}
        <div className="map-container">
          <MapContainer
            center={
              latitude !== null &&
              longitude !== null
                ? [latitude, longitude]
                : [20.5937, 78.9629]
            }
            zoom={latitude !== null ? 13 : 5}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {latitude !== null &&
              longitude !== null &&
              route.length === 0 && (
                <ChangeMapView
                  latitude={latitude}
                  longitude={longitude}
                />
              )}

            <LocationMarker
              latitude={latitude}
              longitude={longitude}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
            />

            {suppliers
              .filter(
                (supplier) =>
                  supplier.latitude !== null &&
                  supplier.longitude !== null,
              )
              .map((supplier) => (
                <Marker
                  key={supplier.id}
                  position={[
                    supplier.latitude,
                    supplier.longitude,
                  ]}
                  icon={supplierIcon}
                >
                  <Popup>
                    <strong>
                      {supplier.name}
                    </strong>

                    <br />

                    Type: {supplier.type}

                    <br />

                    Distance:{" "}
                    {Number(
                      supplier.distance,
                    ).toFixed(2)}{" "}
                    km

                    <br />

                    Available:{" "}
                    {supplier.availableQuantity}

                    <br />
                    <br />

                    <button
                      className="table-reserve-btn"
                      onClick={() =>
                        openReservationModal(
                          supplier,
                        )
                      }
                    >
                      Reserve
                    </button>
                  </Popup>
                </Marker>
              ))}

            {route.length > 0 && (
              <Polyline
                positions={route}
                color="blue"
                weight={5}
              />
            )}

            {route.length > 0 && (
              <FitRouteBounds route={route} />
            )}
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

              <td>
                {Number(
                  supplier.distance,
                ).toFixed(2)}{" "}
                km
              </td>

              <td>
                {supplier.availableQuantity}
              </td>

              <td>
                <button
                  className="table-reserve-btn"
                  onClick={() =>
                    openReservationModal(
                      supplier,
                    )
                  }
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
            <h3 className="modal-title">
              Select Request Type
            </h3>

            <label className="modal-radio-label">
              <input
                type="radio"
                value="PICKUP"
                checked={
                  requestType === "PICKUP"
                }
                onChange={(e) =>
                  setRequestType(
                    e.target.value,
                  )
                }
              />

              Pickup
            </label>

            <label className="modal-radio-label">
              <input
                type="radio"
                value="DELIVERY"
                checked={
                  requestType ===
                  "DELIVERY"
                }
                onChange={(e) =>
                  setRequestType(
                    e.target.value,
                  )
                }
              />

              Delivery
            </label>

            <div className="modal-actions">
              <button
                className="modal-confirm-btn"
                onClick={handleReserve}
              >
                Confirm Reservation
              </button>

              <button
                className="modal-cancel-btn"
                onClick={
                  closeReservationModal
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}