import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  EyeOff,
  Radar,
  MapPin,
  Activity,
  Timer,
  Camera,
  Share2,
} from "lucide-react";

export default function ShareLocation() {
  const [active, setActive] = useState(false);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState("Inactive");

  const watchRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [elapsed, setElapsed] = useState(0);
  const lastCoordsRef = useRef(null);
  const [movement, setMovement] = useState("Unknown");
  const [risk, setRisk] = useState("Low");

  const [capturedImage, setCapturedImage] = useState(null);

  /* ================= ACTIVATE ================= */
  const activateMode = () => {
    setActive(true);
    setStatus("Monitoring surroundings");

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) =>
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      console.error,
      { enableHighAccuracy: true }
    );
  };

  /* ================= DEACTIVATE ================= */
  const deactivateMode = () => {
    setActive(false);
    setStatus("Inactive");
    setElapsed(0);
    setRisk("Low");
    setCapturedImage(null);

    if (watchRef.current)
      navigator.geolocation.clearWatch(watchRef.current);
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [active]);

  /* ================= MOVEMENT ================= */
  useEffect(() => {
    if (!coords || !active) return;

    if (lastCoordsRef.current) {
      const dx = coords.lat - lastCoordsRef.current.lat;
      const dy = coords.lng - lastCoordsRef.current.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.00001) setMovement("Standing");
      else if (dist < 0.00008) setMovement("Walking");
      else setMovement("Erratic");

      if (elapsed > 60) setRisk("Medium");
      if (elapsed > 120) setRisk("High");
    }

    lastCoordsRef.current = coords;
  }, [coords, elapsed, active]);

  /* ================= DROP EVIDENCE (CAPTURE IMAGE) ================= */
  const dropEvidence = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    const video = videoRef.current;
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;

    await new Promise((res) => {
      video.onloadedmetadata = () => {
        video.play();
        res();
      };
    });

    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    const imgData = canvas.toDataURL("image/jpeg");
    setCapturedImage(imgData);

    stream.getTracks().forEach((t) => t.stop());
  };

  /* ================= SHARE IMAGE ================= */
  const shareImage = () => {
    if (!coords) return;

    const mapLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;

    const message = `
🚨 EMERGENCY ALERT 🚨

I am being followed.

📍 Live Location:
${mapLink}

📷 Evidence image captured on my device.
Please assist immediately.
    `.trim();

    const policeNumber = "919999999999"; // replace with real number
    window.open(
      `https://wa.me/${policeNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[5]
            bg-gradient-to-br from-red-950/20 via-transparent to-red-950/20"
            animate={{ opacity: Math.min(0.6, elapsed / 300) }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-90px mt-6 rounded-3xl p-6 bg-black border border-red-500/30 text-white">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <EyeOff className="text-red-400" />
          <h3 className="font-bold text-lg">I’m Being Followed</h3>
        </div>

        <p className="text-sm text-red-400 mb-3">{status}</p>

        {active && (
          <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <Info icon={Activity} label={`Movement: ${movement}`} />
            <Info icon={Radar} label={`Risk: ${risk}`} />
            <Info icon={Timer} label={`Time: ${elapsed}s`} />
            <Info icon={MapPin} label="GPS Locked" />
          </div>
        )}

        <button
          onClick={active ? deactivateMode : activateMode}
          className="w-full py-3 rounded-xl bg-red-600 font-bold mb-4"
        >
          {active ? "Deactivate Safely" : "Activate Silently"}
        </button>

        {/* DROP EVIDENCE */}
        {active && !capturedImage && (
          <button
            onClick={dropEvidence}
            className="w-full py-3 rounded-xl bg-white/10 flex items-center justify-center gap-2"
          >
            <Camera className="h-4 w-4" />
            Drop Evidence
          </button>
        )}

        {/* IMAGE PREVIEW */}
        {capturedImage && (
          <div className="mt-4 space-y-3">
            <img
              src={capturedImage}
              className="rounded-xl border border-red-500/40"
              alt="Evidence"
            />
            <button
              onClick={shareImage}
              className="w-full py-3 rounded-xl bg-green-600 font-bold flex items-center justify-center gap-2 animate-pulse"
            >
              <Share2 className="h-4 w-4" />
              Share Image
            </button>
          </div>
        )}
      </div>

      {/* hidden helpers */}
      <video ref={videoRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}

function Info({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded bg-white/5">
      <Icon className="h-4 w-4 text-red-400" />
      <span>{label}</span>
    </div>
  );
}
