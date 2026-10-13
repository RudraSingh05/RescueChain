
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
