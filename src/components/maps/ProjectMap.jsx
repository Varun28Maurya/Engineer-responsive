// components/maps/ProjectMap.jsx

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { getDistanceInMeters } from "../../utils/geo";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ProjectMap({ lat, lng, radius, onStatusChange }) {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  // Get engineer GPS
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const dist = getDistanceInMeters(
          lat,
          lng,
          latitude,
          longitude
        );

        setUserLocation({ lat: latitude, lng: longitude });
        setDistance(dist);

        onStatusChange?.({
          distance: dist,
          inside: dist <= radius,
        });
      },
      (err) => {
        console.error("GPS error:", err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, [lat, lng, radius, onStatusChange]);

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border">
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Site Marker */}
        <Marker position={[lat, lng]} />

        {/* Geofence Circle */}
        <Circle
          center={[lat, lng]}
          radius={radius}
          pathOptions={{ color: "#2563EB", fillOpacity: 0.15 }}
        />

        {/* Engineer Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
          />
        )}
      </MapContainer>
    </div>
  );
}
