import {
  Shield,
  Navigation,
  ChevronDown,
  LogOut,
  Car,
  House,
  Circle,
  PhoneCall,
  Mail,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const [userName, setUserName] = useState("");
  const [loggedInName, setLoggedInName] = useState("");
  const [currentCity, setCurrentCity] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("currentUserName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const name = localStorage.getItem("loggedInUser");
    if (name) setLoggedInName(name);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const name = localStorage.getItem("loggedInUser");
      if (name !== loggedInName) setLoggedInName(name);
    }, 1000);
    return () => clearInterval(interval);
  }, [loggedInName]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            if (data.city) setCurrentCity(data.city);
            else if (data.locality) setCurrentCity(data.locality);
            else setCurrentCity("Unknown City");
          } catch (err) {
            console.error("Location fetch failed", err);
            setCurrentCity("Location unavailable");
          }
        },
        () => setCurrentCity("Location permission denied")
      );
    } else {
      setCurrentCity("Geolocation not supported");
    }
  }, []);

  const familyMembers = [
    { name: "Father", route: "/FamilyLogin" },
    { name: "Mother", route: "/FamilyLogin" },
    { name: "Son", route: "/FamilyLogin" },
    { name: "Daughter", route: "/FamilyLogin" },
    { name: "Brother", route: "/FamilyLogin" },
    { name: "Sister", route: "/FamilyLogin" },
  ];

  const handleSelect = (member) => {
    setOpen(false);
    setLocation(member.route);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInName("");
    setLocation("/FamilyLogin");
  };

  const iconBtn =
    "p-2.5 bg-slate-800 border border-slate-600 text-slate-200 rounded-xl hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-indigo-500/20";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50 shadow-lg shadow-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">

          {/* LEFT SECTION */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-md">
              <Shield className="text-white w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                NightSafe
              </h1>
              <p className="text-xs tracking-wide text-slate-400 uppercase">
                Night Travel Safety System
              </p>

              {loggedInName && (
                <p className="mt-2 text-xs font-semibold text-yellow-900 bg-yellow-300/90 px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                  👤 Welcome Back! {loggedInName}
                </p>
              )}
            </div>

            <button onClick={() => setLocation("/home")} className={iconBtn}>
              <House size={18} />
            </button>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center space-x-3">

            {/* Live tracking */}
            <div className="hidden md:flex flex-col items-start">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></div>
                <span className="text-sm text-slate-300">Live Tracking</span>
              </div>
            </div>

            {/* Buttons */}
            <button onClick={() => setLocation("/map")} className={iconBtn}>
              <Navigation size={18} />
            </button>

            <button
              onClick={() => setLocation("/mapdashboard")}
              className={iconBtn}
            >
              <Shield size={18} />
            </button>

            <button
              onClick={() => (window.location.href = "/safecab")}
              className={iconBtn}
            >
              <Car size={18} />
            </button>

            <button
              onClick={() => (window.location.href = "/real")}
              className={iconBtn}
            >
              <Circle size={18} />
            </button>

            <button
              onClick={() => (window.location.href = "/flow")}
              className={iconBtn}
            >
              <Circle size={18} />
            </button>

            {/* PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-600 text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-200 shadow-sm"
              >
                <span className="text-sm font-semibold">
                  {userName ? "Connect with family" : "Welcome"}
                </span>

                <img
                  src="usergrp.png"
                  alt="User Profile"
                  className="w-8 h-8 rounded-full border border-slate-500"
                />

                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-52 bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl shadow-black/40 z-20 overflow-hidden">
                  {familyMembers.map((member, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(member)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-150"
                    >
                      {member.name}
                    </button>
                  ))}

                  <div className="border-t border-slate-700"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* LOCATION */}
            {currentCity && (
              <span className="text-xs font-semibold text-amber-900 bg-amber-300 px-3 py-1 rounded-full shadow-sm border border-amber-200">
                📍 {currentCity}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}