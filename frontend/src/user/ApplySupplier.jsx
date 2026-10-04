import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { authAPI } from "../services/api";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

// Update map view when selected location changes
function ChangeMapView({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], 17);
  }, [map, latitude, longitude]);

  return null;
}

// Allow user to click on map and select location
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

export default function ApplySupplier() {
  const [form, setForm] = useState({
    organizationName: "",
    type: "",
  });

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Detect user location
  const detectLocation = () => {
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
        console.error("Failed to detect location:", error);
        alert("Unable to detect your location");
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (latitude === null || longitude === null) {
      alert("Please select your location on the map");
      return;
    }

    try {
      await authAPI.post("/supplier/apply", {
        ...form,
        latitude,
        longitude,
      });

      alert("Supplier application submitted");

      setForm({
        organizationName: "",
        type: "",
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
            <button
              type="button"
              className="form-btn-secondary"
              onClick={detectLocation}
            >
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

            {latitude !== null && longitude !== null && (
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
          </MapContainer>
        </div>
      </div>

      {/* Location preview can be enabled later if needed */}
      {/*
      {latitude !== null && longitude !== null && (
        <p className="location-preview">
          Selected Location: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </p>
      )}
      */}
    </DashboardLayout>
  );
}