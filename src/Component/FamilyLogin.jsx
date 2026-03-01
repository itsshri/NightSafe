import React, { useState } from "react";
import "./FamilyLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lognav2 from "./Lognav2";
import { Shield, PhoneCall, Mail, MapPin, Github, Linkedin } from "lucide-react";

const FamilyLogin = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/family/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          emailOrUsername,
          password,
          deviceInfo: navigator.userAgent // ⭐ NEW (device info)
        })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", data.user.name);

        toast.success(`Welcome back, ${data.user.name}! 🎉`);

        setTimeout(() => {
          window.location.href = "/home";
        }, 2000);
      } else {
        setError(data.message);
        toast.error(data.message);
      }

    } catch (err) {
      setError("Server error");
      toast.error("Server error");
    }
  };

  return (
    <>
      <Lognav2 />
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Family Member Login</h2>
          <p className="login-subtitle">Access the NightSafe Map securely</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username / Name / Phone</label>
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="Enter your username or phone"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <p className="error-msg">{error}</p>}

            <button type="submit" className="login-btn">
              Login
            </button>

            <div className="extra-options">
              <a href="#">Forgot Password?</a>
              <a href="/famsign">Create New Account</a>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>

      {/* FOOTER (unchanged) */}
      <footer className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 text-gray-200 py-8 px-6 shadow-inner border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

          <div className="flex flex-col items-start space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-full border border-white/20">
                <Shield size={26} className="text-yellow-300" />
              </div>
              <h2 className="text-xl font-semibold text-white tracking-wide">NightSafe</h2>
            </div>
            <p className="text-sm text-gray-400">
              Empowering communities with safety insights and live location alerts.
              Stay safe, stay informed.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Quick Links</h3>
            <a href="/" className="hover:text-yellow-400">Home</a>
            <a href="/FamilyLogin" className="hover:text-yellow-400">Member Login</a>
            <a href="/Signup" className="hover:text-yellow-400">Create Account</a>
            <a href="/NightSafeMap" className="hover:text-yellow-400">Map</a>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-yellow-300 mb-2">Contact Us</h3>
            <div className="flex items-center gap-2"><PhoneCall size={18} /><span>+91 94981 11191</span></div>
            <div className="flex items-center gap-2"><Mail size={18} /><span>support@nightsafe.in</span></div>
            <div className="flex items-center gap-2"><MapPin size={18} /><span>Coimbatore, Tamil Nadu</span></div>

            <div className="flex items-center space-x-4 pt-2">
              <a href="https://github.com" target="_blank"><Github size={22} /></a>
              <a href="https://linkedin.com" target="_blank"><Linkedin size={22} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} <span className="text-yellow-300 font-semibold">NightSafe</span> — All Rights Reserved.
        </div>
      </footer>
    </>
  );
};

export default FamilyLogin;