import React, { useEffect, useState } from "react";
import { ref, onValue, set, push, get, query, limitToLast, remove } from "firebase/database";
import { db } from "../firebaseConfig";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import AppHeader from "./AppHeader";

export default function SafeCabVerification({ userId = "ShrijithR" }) {
  const [cabId, setCabId] = useState("");
  const [verified, setVerified] = useState(null);
  const [cabDetails, setCabDetails] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [myLoc, setMyLoc] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [tripActive, setTripActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState([]);

  // 🛰️ Get current location
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const id = navigator.geolocation.watchPosition(
      (pos) => setMyLoc([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  // 📜 Fetch last few trips from Firebase
  useEffect(() => {
    const tripsRef = query(ref(db, `cabTrips/${userId}`), limitToLast(5));
    onValue(tripsRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val)
        .filter(([key, t]) => t.cabId && t.startTime)
        .map(([key, t]) => ({ ...t, tripKey: key })) // keep key for deletion
        .reverse();
      setHistory(arr);
    });
  }, [userId]);

 // 🧾 Verify cab ID
const checkCab = () => {
  if (!cabId.trim()) {
    setStatusMsg("Please enter vehicle number.");
    return;
  }

  const idFormatted = cabId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const r = ref(db, `trustedCabs/${idFormatted}`);

  get(r).then((snap) => {
    const val = snap.val();
    if (val) {
      // ✅ Trusted cab
      setVerified(true);
      setCabDetails(val);
      setStatusMsg("Verified Safe Cab ✓");

      // log trip AFTER verification confirmed
      const tripRef = push(ref(db, `cabTrips/${userId}`));
      set(tripRef, {
        cabId: idFormatted,
        verified: true,
        startTime: Date.now(),
        status: "active",
        driver: val,
      }).then(() => {
        setTripId(tripRef.key);
        setTimeout(() => setTripActive(true), 500);
      });
    } else {
      // ⚠️ Unverified cab
      setVerified(false);
      setCabDetails(null);
      setStatusMsg("⚠️ Cab not registered! Alert sent.");

      // 🚨 Push alert to Firebase
      const alertsRef = push(ref(db, "alerts"));
      set(alertsRef, {
        userId,
        msg: `Unverified cab boarded: ${idFormatted}`,
        lat: myLoc?.[0] ?? null,
        lng: myLoc?.[1] ?? null,
        type: "CAB",
        ts: Date.now(),
      });

      // 🚕 Log unverified trip too (so it appears in history)
      const tripRef = push(ref(db, `cabTrips/${userId}`));
      set(tripRef, {
        cabId: idFormatted,
        verified: false,
        startTime: Date.now(),
        status: "unverified",
        driver: { driverName: "Unknown", company: "Unregistered", rating: "N/A", phone: "N/A" },
      }).then(() => {
        setTripId(tripRef.key);
        setTripActive(false);
      });

      // 📱 Send SMS alert
      const smsBody = encodeURIComponent(
        `⚠️ ${userId} boarded unverified cab: ${idFormatted}. Check immediately.`
      );
      window.open(`sms:+911234567890,+919876543210?body=${smsBody}`, "_self");
    }
  });
};

  // 🚦 End current trip
  const endTrip = () => {
    if (!tripId) return;
    set(ref(db, `cabTrips/${userId}/${tripId}/status`), "completed");
    setTripActive(false);
    setStatusMsg("✅ Trip ended safely.");
  };

  // 🗑️ Delete a trip
  const deleteTrip = (tripKey) => {
    if (!tripKey) return;
    remove(ref(db, `cabTrips/${userId}/${tripKey}`))
      .then(() => setStatusMsg("🗑️ Trip deleted successfully."))
      .catch((e) => console.error("Delete failed:", e));
  };

  // 📱 Share cab details via WhatsApp
  const shareCabInfo = () => {
    if (!cabDetails) return;
    const msg = encodeURIComponent(
      `🚖 Cab Details:\nCab: ${cabId}\nDriver: ${cabDetails.driverName}\nPhone: ${cabDetails.phone}\nCompany: ${cabDetails.company}\nLocation: https://maps.google.com/?q=${myLoc?.[0]},${myLoc?.[1]}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  // 🧠 Submit safety feedback
  const submitFeedback = () => {
    if (!feedback || !tripId) return;
    set(ref(db, `cabTrips/${userId}/${tripId}/feedback`), feedback);
    setFeedback("");
    setStatusMsg("✅ Feedback saved. Thank you!");
  };

  return (
    <>
    <AppHeader/>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900/70 border border-gray-700 rounded-2xl shadow-2xl p-6 text-center"
        >
        <h2 className="text-2xl font-bold text-indigo-400 mb-3">
          🚖 Safe Cab Verification
        </h2>
        <p className="text-gray-400 mb-5 text-sm">
          Verify your cab and stay connected with your guardians.
        </p>

        {/* Input */}
        <input
          type="text"
          value={cabId}
          onChange={(e) => setCabId(e.target.value)}
          placeholder="e.g. TN-38-AB-1234"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-center tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={checkCab}
          className="mt-4 w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all"
          >
          Verify Cab
        </motion.button>

        {verified !== null && (
            <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl border ${
                verified
                ? "border-emerald-500 bg-emerald-900/40"
                : "border-red-500 bg-red-900/30"
            }`}
            >
            <h3
              className={`text-xl font-semibold ${
                  verified ? "text-emerald-400" : "text-red-400"
                }`}
                >
              {verified ? "✅ Verified Cab" : "⚠️ Unverified Cab"}
            </h3>
            <p className="text-gray-300 mt-2 text-sm">{statusMsg}</p>

            {verified && cabDetails && (
                <div className="mt-4 text-left text-sm space-y-1">
                <p><span className="text-gray-400">Driver:</span> {cabDetails.driverName}</p>
                <p><span className="text-gray-400">Company:</span> {cabDetails.company}</p>
                <p><span className="text-gray-400">Rating:</span> {cabDetails.rating} ⭐</p>
                <p><span className="text-gray-400">Phone:</span> {cabDetails.phone}</p>
              </div>
            )}

            {/* QR Code */}
            {tripId && verified && (
                <div className="mt-4 bg-gray-800 p-3 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Share this QR with guardian to verify trip:</p>
                <div className="flex justify-center">
                  <QRCode
                    value={`Trip ID: ${tripId}\nCab: ${cabId}\nDriver: ${cabDetails?.driverName}`}
                    bgColor="#111"
                    fgColor="#10b981"
                    size={120}
                    />
                </div>
              </div>
            )}

            {/* Share & End Trip */}
            {verified && (
                <div className="flex justify-between mt-4 gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={shareCabInfo}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
                  >
                  Share Info
                </motion.button>
                {tripActive && (
                    <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={endTrip}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                    >
                    End Trip
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Feedback */}
        {tripId && !tripActive && (
            <div className="mt-6">
            <h4 className="text-sm text-gray-400 mb-2">Rate your trip experience:</h4>
            <div className="flex justify-center gap-3">
              {["Safe", "Neutral", "Unsafe"].map((opt) => (
                  <motion.button
                  key={opt}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFeedback(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      feedback === opt
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    >
                  {opt}
                </motion.button>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={submitFeedback}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold"
              >
              Submit Feedback
            </motion.button>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
            <div className="mt-8 text-left">
            <h4 className="text-sm font-semibold text-indigo-400 mb-2">
              Recent Trips
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 max-h-40 overflow-auto">
              {history.map((h, i) => (
                  <li
                  key={i}
                  className="p-2 rounded-md bg-gray-800/60 border border-gray-700"
                  >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-medium">{h.cabId}</span>
                      <span
                        className={`${
                            h.verified ? "text-green-400" : "text-red-400"
                        }`}
                        >
                        {h.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteTrip(h.tripKey)}
                      className="px-2 py-1 bg-red-700 hover:bg-red-800 rounded text-[10px] text-white font-semibold"
                      >
                      Delete
                    </motion.button>
                  </div>
                  <div className="text-gray-500 text-[11px] mt-1">
                    {new Date(h.startTime).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-6">
          Your safety is our priority — verify every ride.
        </p>
      </motion.div>

     
    </div>


        </>
    
  );
}
