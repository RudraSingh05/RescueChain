import { useEffect } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
const pin = (color) =>
  L.divIcon({
    className: "custom-map-pin",
    html: `<span style="background:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
export const userPin = pin("#172b28");
export const supplierPin = pin("#779b88");
export function ChangeMapView({ latitude, longitude }) {
  const map = useMap();
  useEffect(() => {
    if (latitude != null && longitude != null)
      map.setView([latitude, longitude], 13);
  }, [map, latitude, longitude]);
  return null;
}
export function LocationMarker({ latitude, longitude, onChange }) {
  useMapEvents({ click: (e) => onChange(e.latlng.lat, e.latlng.lng) });
  return latitude != null && longitude != null ? (
    <Marker icon={userPin} position={[latitude, longitude]} />
  ) : null;
}
export function FitRouteBounds({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 1) map.fitBounds(route, { padding: [36, 36] });
  }, [map, route]);
  return null;
}
