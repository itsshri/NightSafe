import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const LOCATIONS = {
  gandhipuram: [11.0168, 76.9674],
  "rs puram": [11.0085, 76.9560],
  "saibaba colony": [11.0283, 76.9516],
  "police station": [11.0168, 76.9674],
};

function Route({ from, to }) {
  const map = useMap();
  const ref = useRef(null);

  useEffect(() => {
    if (!from || !to) return;

    ref.current?.remove();

    ref.current = L.Routing.control({
      waypoints: [L.latLng(from), L.latLng(to)],
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    return () => ref.current?.remove();
  }, [from, to, map]);

  return null;
}

export function MapView({ destination }) {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const id = navigator.geolocation.watchPosition(
      (pos) =>
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]),
      console.error,
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  if (!position) {
    return (
      <div className="h-[600px] flex items-center justify-center text-white">
        Locating you…
      </div>
    );
  }

  const key = destination?.toLowerCase();
  const destCoords = key ? LOCATIONS[key] : null;

  return (
    <div className="h-[680px] w-full rounded-2xl overflow-hidden border border-white/10">
      <MapContainer
        center={position}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>

        {destCoords && (
          <Route from={position} to={destCoords} />
        )}
      </MapContainer>
    </div>
  );
}
