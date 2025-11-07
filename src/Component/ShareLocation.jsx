// src/components/ShareLocation.jsx
import React, { useEffect, useRef, useState } from "react";
import { ref, set, remove } from "firebase/database";
import { db } from "../firebaseConfig";
import { motion } from "framer-motion";
import FindCabs from "./FindCabs";

const contactsList = [
  { id: "mom", label: "Mom", color: "pink" },
  { id: "dad", label: "Dad", color: "yellow" },
  { id: "sister", label: "Sister", color: "purple" },
  { id: "brother", label: "Brother", color: "green" },
  { id: "friends", label: "Friends", color: "blue" },
];
const defaultLocation = {
  lat: 10.9343, // Sri Krishna College of Technology latitude
  lng: 76.9175  // Sri Krishna College of Technology longitude
};

export default function ShareLocation({ userId }) {
  const [activeContacts, setActiveContacts] = useState({});
  const [status, setStatus] = useState("Waiting for GPS…");
  const watchRef = useRef(null);
  const [coords, setCoords] = useState(null);

  // 📍 track your current coordinates continuously
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation not supported");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude, timestamp: Date.now() });
        setStatus("Location active");
      },
      (err) => setStatus("Error: " + err.message),
      { enableHighAccuracy: true }
    );
    watchRef.current = id;
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // 🚀 push location to Firebase whenever coords or activeContacts change
  useEffect(() => {
    if (!coords) return;
    Object.entries(activeContacts).forEach(([cid, sharing]) => {
      const path = `locations/${cid}/${userId}`;
      if (sharing) {
        set(ref(db, path), coords);
      } else {
        remove(ref(db, path));
      }
    });
  }, [coords, activeContacts]);

  const toggleContact = (cid) =>
    setActiveContacts((prev) => ({
      ...prev,
      [cid]: !prev[cid],
    }));

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl mx-auto w-full">

<br></br>
<br></br>

      {/* 🚨 NEW SECTION: SMS Location Sharing (added without modifying existing code) */}
      <div className="mt-10 border-t border-gray-700 pt-6">
        <h3 className="text-xl font-semibold text-red-400 mb-4 text-center">
          Share Your Location
        </h3>
            <p className="text-sm text-gray-400 mb-6 text-center">{status}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Mom", number: "+919384750414" },
            { name: "Dad", number: "+916374627679" },
            { name: "Friend1", number: "+916380368540" },
            { name: "Brother", number: "+910112233445" },
            { name: "Friend", number: "+910556677889" },
          ].map((c) => (
            <motion.button
              key={c.number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!coords}
              onClick={() => {
                if (!coords) return;
                const msg = encodeURIComponent(
                  `🚨 SOS! My current location:\nhttps://maps.google.com/?q=${coords.lat},${coords.lng}`
                );
                window.location.href = `sms:${c.number}?body=${msg}`;
              }}
              className={`p-4 rounded-xl border transition-all ${
                coords
                  ? "bg-gradient-to-r from-red-600 via-pink-600 to-red-700 hover:shadow-[0_0_25px_rgba(244,63,94,0.7)]"
                  : "bg-gray-700 opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg font-semibold">{c.name}</span>
                <span className="text-xs text-gray-200 mt-1">{c.number}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {coords && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-sm text-gray-300"
          >
            <p>
              <span className="text-indigo-400">Lat:</span> {coords.lat.toFixed(5)}{" "}
              <span className="text-indigo-400">Lng:</span> {coords.lng.toFixed(5)}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Tap a contact to open your SMS app with this location pre-filled
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
