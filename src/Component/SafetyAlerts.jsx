import { AlertTriangle, CheckCircle, Bell, Share, Settings } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import {Phone,MessageCircle,MapPin} from "lucide-react"
// import { useToast } from "@/hooks/use-toast";

export default function SafetyAlerts() {
//   const { toast } = useToast();

const [guardians, setGuardians] = useState([
    {
      id: 1,
      name: "Mom",
      role: "Primary Guardian",
      status: "Online",
      notified: true,
      locationShared: false,
      image: "female.png",
    },
    {
      id: 2,
      name: "Dad",
      role: "Secondary Guardian",
      status: "Offline",
      notified: false,
      locationShared: false,
      image: "son.png",
    },
    {
      id: 3,
      name: "Son",
      role: "User",
      status: "Online",
      notified: false,
      locationShared: true,
      image: "son.png",
    },
  ]);

  // Toggle notification or location sharing
  const toggleGuardianStatus = (id, key) => {
    setGuardians((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, [key]: !g[key] } : g
      )
    );
  };

  const getStatusColor = (status) =>
    status === "Online" ? "bg-green-500" : "bg-red-500";

const handleNotifyGuardians = () => {
  toast.info("All active guardians have been notified of your current status and location.", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const handleShareLocation = () => {
  navigator.clipboard.writeText(`Current Location: Downtown Transit Hub\nSafety Status: Normal\nTracking Link: https://safetravel.ai/track/abc123`);
  toast.success("Location details copied to clipboard!", {
    position: "top-right",
    autoClose: 3000,
  });
};

const handleEmergencySOS = () => {
  toast.error("Emergency SOS Activated! Location sent to contacts and emergency services.", {
    position: "top-right",
    autoClose: 4000,
  });
};


  return (
    <div className="space-y-6" data-testid="safety-alerts">
      {/* Real-time Alerts */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Safety Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg" data-testid="alert-route-deviation">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="text-black w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-500">Route Deviation Detected</p>
              <p className="text-xs text-slate-400 mt-1">You've deviated from the planned route. Guardian notified.</p>
              <p className="text-xs text-slate-500 mt-1">2 minutes ago</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg" data-testid="alert-checkpoint">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="text-white w-3 h-3" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-success-500">Checkpoint Reached</p>
              <p className="text-xs text-slate-400 mt-1">Successfully reached Main Street checkpoint.</p>
              <p className="text-xs text-slate-500 mt-1">15 minutes ago</p>
            </div>
          </div>
        </div>
      </div>



      <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"  // gives attractive colored toast
    />
    </div>
  );
}