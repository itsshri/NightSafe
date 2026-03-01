import React, { useEffect, useState } from "react";
import {
  ref,
  onValue,
  set,
  push,
  get,
  query,
  limitToLast,
  remove,
} from "firebase/database";
import { db } from "../firebaseConfig";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import AppHeader from "./AppHeader";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polygon,
  Popup,
} from "react-leaflet";

export default function SafeCabVerification({ userId = "ShrijithR" }) {

  const [activeView, setActiveView] = useState("verification");

  const [cabId, setCabId] = useState("");
  const [verified, setVerified] = useState(null);
  const [cabDetails, setCabDetails] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [myLoc, setMyLoc] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [tripActive, setTripActive] = useState(false);
  const [history, setHistory] = useState([]);

  

  const [scanState, setScanState] = useState("idle");

  /* LOCATION */
  useEffect(() => {
    const id = navigator.geolocation.watchPosition((pos) => {
      setMyLoc([pos.coords.latitude, pos.coords.longitude]);
    });
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  /* HISTORY */
  useEffect(() => {
    const tripsRef = query(ref(db, `cabTrips/${userId}`), limitToLast(10));
    onValue(tripsRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val)
        .map(([k, t]) => ({ ...t, tripKey: k }))
        .reverse();
      setHistory(arr);
    });
  }, [userId]);

  /* VERIFY CAB */
  const checkCab = async () => {
    if (!cabId.trim()) return;

    const idFormatted = cabId.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

    const snap = await get(ref(db, `trustedCabs/${idFormatted}`));
    const val = snap.val();

    if (val) {
      setVerified(true);
      setCabDetails(val);
      setStatusMsg("Verified Safe Cab ✓");

      const tripRef = push(ref(db, `cabTrips/${userId}`));
      await set(tripRef, {
        cabId: idFormatted,
        verified: true,
        startTime: Date.now(),
        status: "active",
        driver: val,
      });

      setTripId(tripRef.key);
      setTripActive(true);
    } else {
      setVerified(false);
      setStatusMsg("⚠️ Unverified Cab Detected!");
    }
  };

  const startVerification = async () => {
    setScanState("scanning");
    setTimeout(async () => {
      await checkCab();
      setScanState("result");
    }, 2000);
  };

  const endTrip = () => {
    if (!tripId) return;
    set(ref(db, `cabTrips/${userId}/${tripId}/status`), "completed");
    setTripActive(false);
  };

  const deleteTrip = (k) =>
    remove(ref(db, `cabTrips/${userId}/${k}`));

  /* METRICS */
  const stats = {
    total: history.length,
    safe: history.filter((h) => h.verified).length,
    alerts: history.filter((h) => !h.verified).length,
  };

  const riskScore =
    stats.total === 0 ? 10 : Math.min(95, (stats.alerts / stats.total) * 100);

  /* ===== LIVE VERIFICATION VIEW ===== */
  const VerificationView = () => {
    const safetyScore =
      verified === null ? 0 : verified ? 92 : 28;

    return (
      <div className="relative overflow-hidden rounded-2xl border border-indigo-800/40 bg-[#0B1026]/80 backdrop-blur-xl p-6">

        <div className="absolute inset-0 opacity-10 pointer-events-none
          bg-[linear-gradient(to_right,#6C63FF22_1px,transparent_1px),linear-gradient(to_bottom,#6C63FF22_1px,transparent_1px)]
          bg-[size:40px_40px]" />

        <motion.div
          animate={{ opacity:[0.2,0.6,0.2] }}
          transition={{ repeat:Infinity, duration:5 }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/30 blur-3xl rounded-full"
        />

        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-[#6C63FF] mb-2">
            LIVE CAB VERIFICATION
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            Intelligence-grade verification protocol
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md">
            <input
              value={cabId}
              onChange={(e)=>setCabId(e.target.value)}
              placeholder="TN-38-AB-1234"
              className="w-full p-3 rounded-lg bg-black/40 border border-indigo-500/40 text-white tracking-widest"
            />

            <motion.button
              whileTap={{ scale:0.96 }}
              whileHover={{ scale:1.02 }}
              onClick={startVerification}
              className="mt-4 w-full py-3 rounded-lg bg-[#6C63FF] font-semibold"
            >
              Start Secure Verification
            </motion.button>
          </div>

          {scanState === "scanning" && (
            <div className="mt-6 bg-black/40 border border-cyan-400/40 rounded-xl p-5">
              <p className="text-cyan-300 text-sm mb-3">
                🔍 Scanning identity...
              </p>

              <div className="relative h-24 bg-black/40 rounded overflow-hidden">
                <motion.div
                  animate={{ y:["0%","100%","0%"] }}
                  transition={{ repeat:Infinity, duration:1.5 }}
                  className="absolute left-0 w-full h-1 bg-cyan-400"
                />
              </div>
            </div>
          )}

          {scanState === "result" && verified !== null && (
            <motion.div
              initial={{ opacity:0,y:20 }}
              animate={{ opacity:1,y:0 }}
              className={`mt-6 rounded-xl p-5 border ${
                verified
                  ? "border-green-500 bg-green-500/10"
                  : "border-red-500 bg-red-500/10"
              }`}
            >
              <h3 className="font-bold text-lg">
                {verified ? "✔ VERIFIED VEHICLE" : "⚠ THREAT DETECTED"}
              </h3>

              <p className="text-sm mt-2">{statusMsg}</p>

              <div className="mt-4 flex items-center gap-5">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 rotate-[-90deg]">
                    <circle cx="48" cy="48" r="40" stroke="#222" strokeWidth="8" fill="none"/>
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#00FF9D"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={251}
                      strokeDashoffset={251-(251*safetyScore)/100}
                      initial={{ strokeDashoffset:251 }}
                      animate={{ strokeDashoffset:251-(251*safetyScore)/100 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold">
                    {safetyScore}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-300">Safety Score</p>
                  <p className="text-xs text-gray-500">
                    Pattern recognition active
                  </p>
                </div>
              </div>

              {verified && cabDetails && (
                <div className="mt-4 bg-black/30 p-3 rounded-lg">
                  <p>Driver: {cabDetails.driverName}</p>
                  <p className="text-sm text-gray-400">
                    Company: {cabDetails.company}
                  </p>
                </div>
              )}

              {tripId && verified && (
                <div className="mt-4">
                  <QRCode value={`Trip:${tripId}`} size={120}/>
                </div>
              )}

              {tripActive && (
                <button
                  onClick={endTrip}
                  className="mt-4 bg-red-600 px-4 py-2 rounded"
                >
                  End Trip
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    );
  };

const GuardianView = () => {
  const [battery, setBattery] = useState(null);
  const [signal, setSignal] = useState("Checking...");
  const [speed, setSpeed] = useState(0);

  /* ==============================
     BATTERY MONITOR
  ============================== */
  useEffect(() => {
    if (!navigator.getBattery) return;

    let batteryManager;

    navigator.getBattery().then((bat) => {
      batteryManager = bat;
      setBattery(Math.round(bat.level * 100));

      const update = () =>
        setBattery(Math.round(bat.level * 100));

      bat.addEventListener("levelchange", update);

      return () => bat.removeEventListener("levelchange", update);
    });
  }, []);

  /* ==============================
     NETWORK SIGNAL
  ============================== */
  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    if (!connection) {
      setSignal("Unsupported");
      return;
    }

    setSignal(connection.effectiveType);

    const update = () =>
      setSignal(connection.effectiveType);

    connection.addEventListener("change", update);

    return () =>
      connection.removeEventListener("change", update);
  }, []);

  /* ==============================
     SPEED TRACKING
  ============================== */
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const sp = pos.coords.speed;
        setSpeed(sp ? Math.round(sp * 3.6) : 0);
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () =>
      navigator.geolocation.clearWatch(watchId);
  }, []);

  /* ==============================
     MOCK HIGH-RISK ZONES
  ============================== */
  const riskZones = [
    [
      [13.082, 80.27],
      [13.084, 80.275],
      [13.08, 80.279],
    ],
    [
      [13.05, 80.23],
      [13.053, 80.235],
      [13.047, 80.238],
    ],
  ];

  const policeStations = [
    [13.067, 80.24],
    [13.09, 80.28],
  ];

  return (
    <div className="space-y-4">

      {/* TOP METRICS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Battery</p>
          <p className="text-green-400 text-xl font-bold">
            {battery ?? "--"}%
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Network</p>
          <p className="text-cyan-400 text-xl font-bold">{signal}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Speed</p>
          <p className="text-indigo-400 text-xl font-bold">
            {speed} km/h
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Trip Status</p>
          <p className={tripActive ? "text-green-400" : "text-red-400"}>
            {tripActive ? "LIVE MONITORING" : "INACTIVE"}
          </p>
        </div>
      </div>

      {/* LIVE MAP */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="p-3 border-b border-gray-800 text-sm text-gray-400">
          Guardian Live Monitoring Map
        </div>

        <MapContainer
          center={myLoc || [13.0827, 80.2707]}
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* USER POSITION */}
          {myLoc && (
            <Marker position={myLoc}>
              <Popup>Live User Location</Popup>
            </Marker>
          )}

          {/* POLICE COVERAGE */}
          {policeStations.map((p, i) => (
            <Circle
              key={i}
              center={p}
              radius={1000}
              pathOptions={{ color: "blue", fillOpacity: 0.1 }}
            />
          ))}

          {/* HIGH RISK ZONES */}
          {riskZones.map((zone, i) => (
            <Polygon
              key={i}
              positions={zone}
              pathOptions={{
                color: "red",
                fillOpacity: 0.3,
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

  const RiskView = () => (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold mb-3">AI Risk Engine</h2>
      <div className="w-full h-5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width:0 }}
          animate={{ width:`${riskScore}%` }}
          className="h-5 bg-red-500"
        />
      </div>
      <p className="mt-2">Risk Score: {Math.round(riskScore)}%</p>
    </div>
  );

  const AnalyticsView = () => (
    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4">Trip Analytics</h2>

      <table className="w-full text-sm">
        <thead className="border-b border-gray-700 text-gray-400">
          <tr>
            <th className="text-left p-2">Cab</th>
            <th>Status</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {history.map((h)=>(
            <tr key={h.tripKey} className="border-b border-gray-800">
              <td className="p-2">{h.cabId}</td>
              <td className={h.verified?"text-green-400":"text-red-400"}>
                {h.verified?"Verified":"Alert"}
              </td>
              <td>{new Date(h.startTime).toLocaleString()}</td>
              <td>
                <button
                  onClick={()=>deleteTrip(h.tripKey)}
                  className="px-2 py-1 bg-red-700 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* FIXED HERE ONLY */
  const views = {
    verification: VerificationView(),
    guardian: GuardianView(),
    risk: RiskView(),
    analytics: AnalyticsView(),
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-black text-white flex">

        <aside className="w-72 bg-gray-950 border-r border-gray-800 p-6">
          <h2 className="text-2xl font-bold text-indigo-400 mb-6">
            NIGHTSAFE PRO
          </h2>

          {[
            ["verification","🚖 Live Verification"],
            ["guardian","🛡 Guardian Monitor"],
            ["risk","🧠 AI Risk Engine"],
            ["analytics","📊 Analytics"],
          ].map(([k,label])=>(
            <button
              key={k}
              onClick={()=>setActiveView(k)}
              className={`w-full mb-3 p-3 rounded-xl text-left ${
                activeView===k
                  ? "bg-indigo-600"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {label}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-8">

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-xl">Trips: {stats.total}</div>
            <div className="bg-gray-900 p-4 rounded-xl">Verified: {stats.safe}</div>
            <div className="bg-gray-900 p-4 rounded-xl">Alerts: {stats.alerts}</div>
          </div>

          {views[activeView]}
        </main>
      </div>
    </>
  );
}