import React, { useState } from "react";
import "./FamilyLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lognav2 from "./Lognav2";
import { Shield,PhoneCall,Mail,MapPin,Github,Linkedin } from "lucide-react";

const FamilyLogin = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUsers = JSON.parse(localStorage.getItem("familyUsers")) || [];
    const matchedUser = storedUsers.find(
      (user) =>
        (emailOrUsername === user.username ||
          emailOrUsername === user.phone ||
          emailOrUsername === user.name) &&
        password === user.password
    );

    if (matchedUser) {
      setError("");
      // ✅ Save logged-in name for header
      localStorage.setItem("loggedInUser", matchedUser.name);

      toast.success(`Welcome back, ${matchedUser.name}! 🎉`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // ✅ Delay to let toast show before redirecting
      setTimeout(() => {
        window.location.href = "/home";
      }, 2000);
    } else {
      setError("Invalid username or password. Please try again.");
      toast.error("❌ Invalid username or password. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
          
       <footer className="bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 text-gray-200 py-8 px-6 shadow-inner border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* Brand Section */}
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

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Quick Links</h3>
          <a href="/" className="hover:text-yellow-400 transition-colors duration-200">Home</a>
          <a href="/FamilyLogin" className="hover:text-yellow-400 transition-colors duration-200">Member Login</a>
          <a href="/Signup" className="hover:text-yellow-400 transition-colors duration-200">Create Account</a>
          <a href="/NightSafeMap" className="hover:text-yellow-400 transition-colors duration-200">Map</a>
        </div>

        {/* Contact & Socials */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Contact Us</h3>
          <div className="flex items-center gap-2">
            <PhoneCall size={18} /> 
            <span className="text-sm">+91 94981 11191</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} /> 
            <span className="text-sm">support@nightsafe.in</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} /> 
            <span className="text-sm">Coimbatore, Tamil Nadu</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 pt-2">
            <a href="https://github.com" target="_blank" className="hover:text-yellow-400 transition-transform transform hover:scale-110">
              <Github size={22} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="hover:text-yellow-400 transition-transform transform hover:scale-110">
              <Linkedin size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/10 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-yellow-300 font-semibold">NightSafe</span> — All Rights Reserved.
      </div>
    </footer>
    </>
  );
};

export default FamilyLogin;
