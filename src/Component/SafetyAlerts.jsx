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

      {/* Guardian Dashboard */}
       <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Guardian Dashboard
      </h3>

      <div className="space-y-4">
        {guardians.map((guardian) => (
          <div
            key={guardian.id}
            className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
          >
            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <img
                src={guardian.image}
                alt={guardian.name}
                className="w-10 h-10 rounded-full border border-slate-500"
              />
              <div>
                <p className="font-medium text-slate-200">{guardian.name}</p>
                <p className="text-xs text-slate-400">{guardian.role}</p>
              </div>
            </div>

            {/* Status + Actions */}
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  guardian.status
                )}`}
              ></div>
              <span
                className={`text-xs ${
                  guardian.status === "Online"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {guardian.status}
              </span>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-3">
                <button
                  onClick={() => alert(`Calling ${guardian.name}...`)}
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-white"
                  title="Call"
                >
                  <Phone size={16} />
                </button>
                <button
                  onClick={() => alert(`Messaging ${guardian.name}...`)}
                  className="p-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-md text-white"
                  title="Message"
                >
                  <MessageCircle size={16} />
                </button>
                <button
                  onClick={() => alert(`Locating ${guardian.name}...`)}
                  className="p-1.5 bg-purple-600 hover:bg-purple-700 rounded-md text-white"
                  title="Locate"
                >
                  <MapPin size={16} />
                </button>
              </div>

              {/* Toggle Buttons */}
              <button
                onClick={() => toggleGuardianStatus(guardian.id, "notified")}
                className={`ml-3 px-2 py-1 text-xs rounded-md font-semibold ${
                  guardian.notified
                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    : "bg-slate-600 text-slate-300"
                }`}
              >
                <Bell size={14} className="inline mr-1" />
                {guardian.notified ? "Notified" : "Notify"}
              </button>

              <button
                onClick={() => toggleGuardianStatus(guardian.id, "locationShared")}
                className={`px-2 py-1 text-xs rounded-md font-semibold ${
                  guardian.locationShared
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-slate-600 text-slate-300"
                }`}
              >
                {guardian.locationShared ? "Location Shared" : "Share Location"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

      {/* Emergency Actions */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Emergency Actions</h3>
          <button className="text-primary-400 text-sm hover:text-primary-300" data-testid="manage-contacts">
            <Settings className="w-4 h-4 mr-1 inline" />
            Manage
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button 
            className="bg-red-600 hover:bg-danger-700 text-white p-4 rounded-lg font-semibold text-center transition-colors flex items-center justify-center space-x-2"
            onClick={handleEmergencySOS}
            data-testid="button-emergency-sos"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency SOS</span>
          </button>
          <button 
            className="bg-yellow-600 hover:bg-warning-700 text-white p-3 rounded-lg font-medium text-center transition-colors flex items-center justify-center space-x-2"
            onClick={handleNotifyGuardians}
            data-testid="button-notify-guardians"
          >
            <Bell className="w-4 h-4" />
            <span>Notify Guardians</span>
          </button>
          <button 
            className="bg-blue-600 hover:bg-primary-700 text-white p-3 rounded-lg font-medium text-center transition-colors flex items-center justify-center space-x-2"
            onClick={handleShareLocation}
            data-testid="button-share-location"
          >
            <Share className="w-4 h-4" />
            <span>Share Location</span>
          </button>
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