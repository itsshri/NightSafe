import { Shield, Navigation, ChevronDown, LogOut,Car,House } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import {PhoneCall,Mail,MapPin,Github,Linkedin } from "lucide-react";

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

  // ✅ Load logged-in name on mount
  useEffect(() => {
    const name = localStorage.getItem("loggedInUser");
    if (name) setLoggedInName(name);
  }, []);

  // ✅ Watch for logged-in name changes
  useEffect(() => {
    const interval = setInterval(() => {
      const name = localStorage.getItem("loggedInUser");
      if (name !== loggedInName) setLoggedInName(name);
    }, 1000);
    return () => clearInterval(interval);
  }, [loggedInName]);

  // ✅ Get live browser location
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
            if (data.city) {
              setCurrentCity(data.city);
            } else if (data.locality) {
              setCurrentCity(data.locality);
            } else {
              setCurrentCity("Unknown City");
            }
          } catch (err) {
            console.error("Location fetch failed", err);
            setCurrentCity("Location unavailable");
          }
        },
        (err) => {
          console.warn("Location permission denied:", err);
          setCurrentCity("Location permission denied");
        }
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

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left section */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NightSafe</h1>
              <p className="text-sm text-slate-400">Night Travel Safety System</p>

              {loggedInName && (
                <p className="mt-1 text-black font-semibold text-sm bg-yellow-400 px-3 py-1 rounded-full inline-block shadow-md animate-pulse">
                  👤 Welcome Back! {loggedInName}
                </p>
              )}
              
            </div>
            
            <button
              onClick={() => setLocation("/home")}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-yellow-600"
              >
              <House />
            </button>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-start space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">Live Tracking</span>
              </div>
            </div>

            {/* Map button */}

            <button
              onClick={() => setLocation("/map")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
              <Navigation />
            </button>

            {/* Dashboard */}
            
            <button
              onClick={() => setLocation("/mapdashboard")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-indigo-700"
              >
              <Shield />
            </button>

            {/* Safe Cab */}
            <button
  onClick={() => (window.location.href = "/safecab")}
  className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
>
  <Car/>
</button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition focus:outline-none"
                >
                <span className="text-lg font-semibold">
                  {userName ? `Connect with family` : "Welcome"}
                </span>
                <img
                  src="usergrp.png"
                  alt="User Profile"
                  className="w-8 h-8 rounded-full"
                  />
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                  />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-20 animate-fadeIn">
                  {familyMembers.map((member, index) => (
                    <button
                    key={index}
                    onClick={() => handleSelect(member)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-indigo-600 hover:text-white transition"
                    >
                      {member.name}
                    </button>
                  ))}

                  <div className="border-t border-slate-700 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition flex items-center gap-2"
                    >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
              {currentCity && (
                <span className="text-xl text-black font-semibold text-sm bg-yellow-400 px-3 py-1 rounded-full inline-block shadow-md animate-pulse">
                  📍 {currentCity}
                </span>
              )}
          </div>
        </div>
      </div>
    </header>
  );
}
