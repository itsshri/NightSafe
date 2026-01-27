import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Activity,
  UserCheck,
  Zap,
  MapPin,
  Eye,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useDestination } from "../pages/DestinationContext";

/* ================= SAFE DESTINATIONS ================= */
const SAFE_PLACES = {
  gandhipuram: true,
  "police station": true,
  "rs puram": true,
  "saibaba colony": true,
};

/* ================= USER EMERGENCY PROFILE ================= */
const USER_PROFILE = {
  name: "Shrijith R",
  age: 22,
  phone: "XXXXXXXXXX", // 🔴 replace with your number
};

/* ================= TN POLICE WHATSAPP ================= */
// ⚠️ Replace ONLY if official number is provided
const TN_POLICE_WHATSAPP = "919994444444";

export function Side({ isOpen, onClose }) {
  /* ---------------- STATES ---------------- */
  const [buddyActive, setBuddyActive] = useState(false);
  const [acousticThreat, setAcousticThreat] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);
  const [threatDetected, setThreatDetected] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [seconds, setSeconds] = useState(0);

  /* ---------------- CONTEXT ---------------- */
  const { setAskDestination } = useDestination();

  /* ---------------- REFS ---------------- */
  const audioCtx = useRef(null);
  const analyser = useRef(null);
  const micStream = useRef(null);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!buddyActive) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [buddyActive]);

  /* ---------------- SPEAK (TAMIL + ENGLISH) ---------------- */
  const speak = (ta, en) => {
    if (!audioUnlocked) return;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find((v) => v.lang === "ta-IN");
    const englishVoice = voices.find((v) => v.lang === "en-IN");

    const tamilMsg = new SpeechSynthesisUtterance(ta);
    tamilMsg.lang = "ta-IN";
    tamilMsg.voice = tamilVoice || null;
    tamilMsg.rate = 0.9;

    const englishMsg = new SpeechSynthesisUtterance(en);
    englishMsg.lang = "en-IN";
    englishMsg.voice = englishVoice || null;
    englishMsg.rate = 0.95;

    window.speechSynthesis.speak(tamilMsg);
    window.speechSynthesis.speak(englishMsg);
  };

  /* ---------------- AUDIO UNLOCK ---------------- */
  const unlockAudio = () => {
    speak("குரல் இயக்கப்பட்டது", "Voice enabled");
    setAudioUnlocked(true);
  };

  /* ---------------- STOP MIC ---------------- */
  const stopMic = () => {
    audioCtx.current?.close();
    micStream.current?.getTracks().forEach((t) => t.stop());
  };

  /* ---------------- DESTINATION FLOW ---------------- */
  const askForDestination = () => {
    speak(
      "தயவுசெய்து உங்கள் இலக்கை கூறுங்கள்",
      "Please state your destination"
    );
    setAskDestination(true);
  };

  /* ================= EMERGENCY WHATSAPP SHARE ================= */
  const shareWithTamilNaduPolice = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;

      const message = `
🚨 EMERGENCY ALERT 🚨

👤 Name: Shrijith R
🎂 Age: 21
📞 Phone: "6380368540"

📍 Live Location:
${locationLink}

⚠️ Threat detected. Immediate help required.

தமிழ்நாடு காவல்துறைக்கு உடனடி உதவி தேவை
      `.trim();

      const url = `https://wa.me/${TN_POLICE_WHATSAPP}?text=${encodeURIComponent(
        message
      )}`;

      window.open(url, "_blank");
    });
  };

  /* ---------------- ACOUSTIC MONITOR ---------------- */
  useEffect(() => {
    if (!acousticThreat || !audioUnlocked) return;

    const startMic = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      micStream.current = stream;

      audioCtx.current = new AudioContext();
      analyser.current = audioCtx.current.createAnalyser();
      analyser.current.fftSize = 256;

      const src =
        audioCtx.current.createMediaStreamSource(stream);
      src.connect(analyser.current);

      const data = new Uint8Array(
        analyser.current.frequencyBinCount
      );

      const monitor = () => {
        analyser.current.getByteFrequencyData(data);
        const avg =
          data.reduce((a, b) => a + b, 0) / data.length;

        setSoundLevel(Math.round(avg));

        if (avg > 100 && !threatDetected) {
          setThreatDetected(true);
          setBuddyActive(true);
          stopMic();

          speak(
            "ஆபத்து கண்டறியப்பட்டது. உதவி அனுப்பப்படுகிறது",
            "Threat detected. Sending help"
          );

          setTimeout(askForDestination, 1200);
          return;
        }

        requestAnimationFrame(monitor);
      };

      monitor();
    };

    startMic();
    return stopMic;
  }, [acousticThreat, audioUnlocked, threatDetected]);

  /* ---------------- AUTO SHARE TO POLICE ---------------- */
  useEffect(() => {
    if (threatDetected) {
      shareWithTamilNaduPolice();
    }
  }, [threatDetected]);

  /* ---------------- UI ---------------- */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
       

<motion.div
  className="fixed left-0 top-20 bottom-0 w-80 bg-gradient-to-b from-slate-900 to-black
             z-[700] p-6 border-r border-white/10 overflow-y-auto
             rounded-tr-2xl rounded-br-2xl"
  initial={{ x: "-100%" }}
  animate={{ x: 0 }}
  exit={{ x: "-100%" }}
>

            {!audioUnlocked && (
              <button
                onClick={unlockAudio}
                className="w-full mb-4 py-2 bg-green-600 rounded-xl text-white font-bold"
              >
                Enable Voice
              </button>
            )}

            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-7 w-7 text-green-400" />
              <div>
                <h2 className="text-xl font-black text-white">
                  GUARD CENTRAL
                </h2>
                <p className="text-xs text-gray-400">
                  Session {seconds}s active
                </p>
              </div>
            </div>

            <Section title="Virtual Companion">
              <Toggle
                icon={UserCheck}
                label="Companion Sync"
                value={buddyActive}
                onChange={setBuddyActive}
              />
            </Section>

            <Section title="AI Sentinel">
              <Feature
                icon={Activity}
                title={`Acoustic Monitor (${soundLevel})`}
                active={acousticThreat}
                onClick={() => setAcousticThreat((v) => !v)}
              />
            </Section>

            <Section title="Focus">
              <Toggle
                icon={Eye}
                label="Focus Mode"
                value={focusMode}
                onChange={setFocusMode}
              />
            </Section>

            <Section title="Quick Safe Routes">
              {Object.keys(SAFE_PLACES).map((place) => (
                <button
                  key={place}
                  onClick={askForDestination}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm"
                >
                  <MapPin className="h-4 w-4 text-green-400" />
                  {place}
                </button>
              ))}
            </Section>

            {threatDetected && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500 text-red-400 text-xs font-bold animate-pulse">
                🚨 Emergency shared with police
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ---------------- HELPERS ---------------- */

function Section({ title, children }) {
  return (
    <div className="space-y-3 mb-5">
      <div className="flex justify-between">
        <h3 className="text-xs uppercase text-gray-400">{title}</h3>
        <Badge variant="outline">LIVE</Badge>
      </div>
      {children}
    </div>
  );
}

function Toggle({ icon: Icon, label, value, onChange }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl border border-white/10">
      <div className="flex gap-2 items-center">
        <Icon className="h-4 w-4 text-green-400" />
        <span className="text-sm font-bold text-white">
          {label}
        </span>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function Feature({ icon: Icon, title, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex justify-between items-center p-3 rounded-xl border ${
        active
          ? "bg-green-500/10 border-green-500"
          : "border-white/10 hover:bg-white/5"
      }`}
    >
      <div className="flex gap-2 items-center">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-bold text-white">
          {title}
        </span>
      </div>
      <Zap className={active ? "text-green-500" : "opacity-20"} />
    </div>
  );
}
