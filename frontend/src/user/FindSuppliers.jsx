import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { Crosshair, Search, ArrowRight, X, MapPin } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import {
  PageHeader,
  Panel,
  TableScroll,
  Empty,
  Loading,
  Notice,
} from "../components/UI";
import { readable } from "../utils/formatters";
import {
  ChangeMapView,
  LocationMarker,
  FitRouteBounds,
} from "../components/MapTools";
import { supplierPin } from "../utils/mapIcons";
import { inventoryAPI, errorMessage } from "../services/api";
import useAuthStore from "../store/authStore";
export default function FindSuppliers() {
  const userId = useAuthStore((s) => s.userId);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);
  const [selected, setSelected] = useState(null);
  const [requestType, setRequestType] = useState("PICKUP");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  function setLocation(lat, lng) {
    setLatitude(lat);
    setLongitude(lng);
    setRoute([]);
  }
  function detect(silent = false) {
    if (!navigator.geolocation) {
      if (!silent)
        setError("Geolocation is unavailable. Choose a point on the map.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => setLocation(p.coords.latitude, p.coords.longitude),
      () => {
        if (!silent)
          setError("Location unavailable. Choose a point on the map.");
      },
    );
  }
  useEffect(() => {
    if (!navigator.geolocation) return;

    let active = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) return;
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setRoute([]);
      },
      () => {}, // Silently fall back to selecting a point on the map.
    );

    return () => {
      active = false;
    };
  }, []);
  async function fetchRoute(a, b, c, d) {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${b},${a};${d},${c}?overview=full&geometries=geojson`,
      );
      if (!response.ok) throw Error("Route unavailable");
      const data = await response.json();
      setRoute(
        (data.routes?.[0]?.geometry?.coordinates || []).map(([lng, lat]) => [
          lat,
          lng,
        ]),
      );
    } catch {
      setRoute([]);
    }
  }
  async function search(e) {
    e.preventDefault();
    if (latitude == null || longitude == null) {
      setError("Choose your location on the map first.");
      return;
    }
    if (!Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setError("Enter a positive whole-number quantity.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    setRoute([]);
    setSearched(true);
    try {
      const r = await inventoryAPI.get("/user/suppliers/nearest", {
        params: { itemName, quantity, latitude, longitude },
      });
      setSuppliers(r.data);
      if (
        r.data.length &&
        r.data[0].latitude != null &&
        r.data[0].longitude != null
      )
        fetchRoute(
          latitude,
          longitude,
          r.data[0].latitude,
          r.data[0].longitude,
        );
    } catch (e) {
      setError(errorMessage(e, "Unable to find suppliers"));
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }
  async function reserve() {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await inventoryAPI.post("/user/reserve", {
        supplierId: selected.id,
        itemName,
        quantity: Number(quantity),
        requestType,
        userId,
      });
      setSuccess("Reservation confirmed. View it under My reservations.");
      setSelected(null);
    } catch (e) {
      setError(errorMessage(e, "Unable to complete reservation"));
      setSelected(null);
    } finally {
      setBusy(false);
    }
  }
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="SUPPLY DISCOVERY"
        title="Find nearby supplies"
        description="Locate available emergency supplies and reserve directly from trusted organizations."
      />
      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>
      <div className="map-form-grid">
        <Panel title="Search availability" subtitle="Tell us what you need">
          <form onSubmit={search} className="form-stack">
            <label className="field">
              <span>Supply item</span>
              <input
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Oxygen cylinder"
              />
            </label>
            <label className="field">
              <span>Required quantity</span>
              <input
                required
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Number of units"
              />
            </label>
            <div className="location-info">
              <span className="field-caption">SEARCH LOCATION</span>
              <p>
                {latitude == null
                  ? "Select a location on the map."
                  : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}
              </p>
            </div>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => detect()}
            >
              <Crosshair size={17} /> Use my location
            </button>
            <button
              disabled={loading}
              className="btn btn-primary"
              type="submit"
            >
              <Search size={17} />
              {loading ? "Searching…" : "Find suppliers"}
            </button>
          </form>
        </Panel>
        <Panel
          title="Supplier map"
          subtitle="Select a location or inspect nearby suppliers"
        >
          <div className="map-frame">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {latitude != null && route.length === 0 && (
                <ChangeMapView latitude={latitude} longitude={longitude} />
              )}
              <LocationMarker
                latitude={latitude}
                longitude={longitude}
                onChange={setLocation}
              />
              {suppliers
                .filter((s) => s.latitude != null && s.longitude != null)
                .map((s) => (
                  <Marker
                    key={s.id}
                    icon={supplierPin}
                    position={[s.latitude, s.longitude]}
                  >
                    <Popup>
                      <strong>{s.name}</strong>
                      <p>
                        {readable(s.type)} · {Number(s.distance).toFixed(2)} km
                      </p>
                      <p>{s.availableQuantity} units available</p>
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => setSelected(s)}
                      >
                        Reserve <ArrowRight size={14} />
                      </button>
                    </Popup>
                  </Marker>
                ))}
              {route.length > 1 && (
                <>
                  <Polyline
                    positions={route}
                    pathOptions={{ color: "#42645b", weight: 4 }}
                  />
                  <FitRouteBounds route={route} />
                </>
              )}
            </MapContainer>
          </div>
        </Panel>
      </div>
      <Panel
        title="Available suppliers"
        subtitle={
          searched
            ? `${suppliers.length} matching organizations`
            : "Search to view available suppliers"
        }
      >
        {loading ? (
          <Loading label="Finding available supplies…" />
        ) : suppliers.length ? (
          <TableScroll>
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Distance</th>
                <th>Available</th>
                <th className="right">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="primary-cell">
                    <MapPin size={15} className="inline-icon" />
                    {s.name}
                  </td>
                  <td>{readable(s.type)}</td>
                  <td>{Number(s.distance).toFixed(2)} km</td>
                  <td>{s.availableQuantity}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn btn-primary btn-small"
                        onClick={() => setSelected(s)}
                      >
                        Reserve <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableScroll>
        ) : (
          <Empty
            title={
              searched
                ? "No matching suppliers"
                : "Your search results appear here"
            }
            description={
              searched
                ? "Try a different supply item or location."
                : "Enter an item and quantity to discover nearby availability."
            }
          />
        )}
      </Panel>
      {selected && (
        <div
          className="modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !busy) setSelected(null);
          }}
        >
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reserve-title"
          >
            <button
              className="icon-btn modal-close"
              aria-label="Close"
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
            <p className="eyebrow">CONFIRM REQUEST</p>
            <h2 id="reserve-title">Reserve supplies</h2>
            <p className="modal-description">
              {quantity} × {itemName} from <strong>{selected.name}</strong>
            </p>
            <fieldset className="choice-field">
              <legend>Fulfillment method</legend>
              <label
                className={`choice ${requestType === "PICKUP" ? "choice-selected" : ""}`}
              >
                <input
                  type="radio"
                  name="requestType"
                  value="PICKUP"
                  checked={requestType === "PICKUP"}
                  onChange={() => setRequestType("PICKUP")}
                />
                <span>
                  <strong>Pickup</strong>
                  <small>
                    Collect from the supplier. Pickup reservations expire after
                    15 minutes.
                  </small>
                </span>
              </label>
              <label
                className={`choice ${requestType === "DELIVERY" ? "choice-selected" : ""}`}
              >
                <input
                  type="radio"
                  name="requestType"
                  value="DELIVERY"
                  checked={requestType === "DELIVERY"}
                  onChange={() => setRequestType("DELIVERY")}
                />
                <span>
                  <strong>Delivery</strong>
                  <small>
                    Request delivery coordination. A short cancellation window
                    applies.
                  </small>
                </span>
              </label>
            </fieldset>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setSelected(null)}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={reserve}
                disabled={busy}
              >
                {busy ? "Reserving…" : "Confirm reservation"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
