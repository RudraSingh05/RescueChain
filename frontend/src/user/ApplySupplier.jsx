import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Crosshair, Send } from "lucide-react";
import DashboardLayout from "../layout/DashboardLayout";
import { PageHeader, Panel, Notice } from "../components/UI";
import { ChangeMapView, LocationMarker } from "../components/MapTools";
import { authAPI, errorMessage } from "../services/api";
const TYPES = [
  ["WAREHOUSE", "Warehouse"],
  ["PHARMACY", "Pharmacy"],
  ["BLOOD_BANK", "Blood bank"],
  ["OXYGEN_SUPPLIER", "Oxygen supplier"],
];
export default function ApplySupplier() {
  const [form, setForm] = useState({ organizationName: "", type: "" });
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  function detect() {
    if (!navigator.geolocation) {
      setError("Geolocation is unavailable in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLatitude(p.coords.latitude);
        setLongitude(p.coords.longitude);
      },
      () =>
        setError(
          "Location unavailable. Click the map to select your location.",
        ),
    );
  }
  async function submit(e) {
    e.preventDefault();
    if (latitude == null || longitude == null) {
      setError("Select your organization location on the map.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await authAPI.post("/supplier/apply", { ...form, latitude, longitude });
      setSuccess("Your application has been submitted.");
      setForm({ organizationName: "", type: "" });
      setLatitude(null);
      setLongitude(null);
    } catch (e) {
      setError(errorMessage(e, "Unable to submit application"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="JOIN THE NETWORK"
        title="Become a supplier"
        description="Apply to make your organization’s essential supplies discoverable."
      />
      <Notice>{error}</Notice>
      <Notice type="success">{success}</Notice>
      <div className="map-form-grid">
        <Panel
          title="Organization details"
          subtitle="Tell us about your supply organization"
        >
          <form onSubmit={submit} className="form-stack">
            <label className="field">
              <span>Organization name</span>
              <input
                required
                value={form.organizationName}
                onChange={(e) =>
                  setForm((v) => ({ ...v, organizationName: e.target.value }))
                }
                placeholder="Registered organization name"
              />
            </label>
            <label className="field">
              <span>Supplier category</span>
              <select
                required
                value={form.type}
                onChange={(e) =>
                  setForm((v) => ({ ...v, type: e.target.value }))
                }
              >
                <option value="">Select a category</option>
                {TYPES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div className="location-info">
              <span className="field-caption">LOCATION</span>
              <p>
                {latitude == null
                  ? "Choose your location on the map or use your current location."
                  : `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={detect}
            >
              <Crosshair size={17} /> Use my location
            </button>
            <button type="submit" disabled={busy} className="btn btn-primary">
              <Send size={16} />
              {busy ? "Submitting…" : "Submit application"}
            </button>
          </form>
        </Panel>
        <Panel
          title="Organization location"
          subtitle="Click the map to place your location marker"
        >
          <div className="map-frame">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {latitude != null && (
                <ChangeMapView latitude={latitude} longitude={longitude} />
              )}
              <LocationMarker
                latitude={latitude}
                longitude={longitude}
                onChange={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
              />
            </MapContainer>
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
