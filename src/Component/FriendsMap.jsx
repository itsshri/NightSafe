// src/components/FriendsMap.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebaseConfig";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom icon for user's location
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -28],
});

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position]);
  return null;
}

export default function FriendsMap({ friendIds }) {
  const [locations, setLocations] = useState({});
  const [myLocation, setMyLocation] = useState(null);
  const [error, setError] = useState(null);

  // 🔹 Track friends from Firebase
  useEffect(() => {
    const unsubscribes = friendIds.map((fid) => {
      const locRef = ref(db, `locations/${fid}`);
      const unsubscribe = onValue(locRef, (snap) => {
        const val = snap.val();
        if (val) {
          setLocations((prev) => ({ ...prev, [fid]: val }));
        }
      });
      return unsubscribe;
    });
    return () => unsubscribes.forEach((u) => u());
  }, [friendIds]);

  // 🔹 Track current user's own live location
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setMyLocation([latitude, longitude]);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const defaultCenter = [20.5937, 78.9629];
  const center = myLocation || defaultCenter;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-800 relative">
      {error && (
        <p className="absolute top-2 left-2 bg-red-700/70 px-4 py-2 rounded-lg text-sm text-white z-[999]">
          ⚠️ {error}
        </p>
      )}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "60vh", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter position={myLocation} />

        {/* 🔵 Current user marker */}
        {myLocation && (
          <>
            <Marker position={myLocation} icon={userIcon}>
              <Popup>
                <p className="font-bold text-blue-500">You are here</p>
              </Popup>
            </Marker>
            <CircleMarker
              center={myLocation}
              radius={25}
              pathOptions={{
                color: "rgba(59,130,246,0.4)",
                fillColor: "rgba(59,130,246,0.3)",
                fillOpacity: 0.3,
              }}
            />
          </>
        )}

        {/* 🧭 Friends markers */}
        {Object.entries(locations).map(([id, { lat, lng, timestamp }]) => (
          <Marker key={id} position={[lat, lng]}>
            <Popup>
              <p className="font-bold text-indigo-600">{id}</p>
              <p>{new Date(timestamp).toLocaleTimeString()}</p>
            </Popup>
          </Marker>
        ))}
        {Object.entries(locations).map(([id, { lat, lng }]) => (
          <CircleMarker
            key={id + "_circle"}
            center={[lat, lng]}
            radius={20}
            pathOptions={{ color: "rgba(99,102,241,0.3)" }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
