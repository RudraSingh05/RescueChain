import { useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap
} from "react-leaflet";

export default function ApplySupplier() {

  const [form, setForm] = useState({
    organizationName: "",
    type: ""
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Detect user location
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  // Update map view
  function ChangeMapView({ center }) {
    const map = useMap();
    map.setView(center, 17);
    return null;
  }

  // Click to set marker
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!latitude || !longitude) {
        alert("Please select your location on the map");
        return;
      }
      await authAPI.post("/supplier/apply", {
        ...form,
        latitude,
        longitude
      });
      alert("Supplier application submitted");
      setForm({
        organizationName: "",
        type: ""
      });
      setLatitude(null);
      setLongitude(null);
    } catch (error) {
      alert(error.response?.data?.error || "Application failed");
    }
  };


  return (
    <DashboardLayout>

      <h1 className="page-title">Apply to Become Supplier</h1>

      <div className="side-by-side">
        <form onSubmit={handleSubmit} className="form-card">
          <input
            className="form-input"
            name="organizationName"
            placeholder="Organization Name"
            value={form.organizationName}
            onChange={handleChange}
            required
          />

          <input
            className="form-input"
            name="type"
            placeholder="Type (Hospital / NGO / Pharmacy)"
            value={form.type}
            onChange={handleChange}
            required
          />

          <div className="form-btn-group">
            <button type="button" className="form-btn-secondary" onClick={detectLocation}>
              Use My Location
            </button>
            <button className="form-btn" type="submit">
              Apply
            </button>
          </div>
        </form>

        <div className="map-container">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {latitude && longitude && (
              <ChangeMapView center={[latitude, longitude]} />
            )}
            <LocationMarker />
          </MapContainer>
        </div>
      </div>

      {/* {latitude && longitude && (
            <p className="location-preview">
                Selected Location: {latitude.toFixed(5)} , {longitude.toFixed(5)}
            </p>
        )} */}

    </DashboardLayout>
  );
}