import React, { useState } from "react";
import "./FamilySignup.css";
import { Shield } from "lucide-react";
import { Navigation } from "lucide-react";
import Lognav from "./Lognav";
import {PhoneCall,Mail,MapPin,Github,Linkedin } from "lucide-react";

const FamSign = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    memberType: "",
    username: "",
    password: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let key in formData) {
      if (formData[key].trim() === "") {
        setError("Please fill all fields before submitting.");
        return;
      }
    }

    // ✅ Save multiple users
    let existingUsers = JSON.parse(localStorage.getItem("familyUsers")) || [];
    existingUsers.push(formData);
    localStorage.setItem("familyUsers", JSON.stringify(existingUsers));

    // ✅ NEW: store current user name and location for header display
    localStorage.setItem("currentUserName", formData.name);
    localStorage.setItem("loggedInUser", formData.name);

    // Optional: ensure header can find correct location
    const userWithLocation = existingUsers.find(
      (user) => user.name === formData.name
    );
    if (userWithLocation) {
      console.log("Saved location:", userWithLocation.location);
    }

    setSuccess("Account created successfully! You can now log in.");
    setFormData({
      name: "",
      phone: "",
      memberType: "",
      username: "",
      password: "",
      location: "",
    });
  };

  return (
    <>
      <Lognav />
      <br />
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Create Family Account</h2>
          <p className="signup-subtitle">Join the NightSafe Map network</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your full name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="Enter your phone number"
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
              />
            </div>

            <div className="input-group">
              <label>Member Type</label>
              <select
                name="memberType"
                value={formData.memberType}
                onChange={handleChange}
                required
              >
                <option value="">Select Member Type</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Sister">Sister</option>
                <option value="Brother">Brother</option>
              </select>
            </div>

            <div className="input-group">
              <label>Set Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                placeholder="Choose a username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Set Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Create a password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>Location (City in Tamil Nadu)</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Your City</option>
                {[
                  "Chennai",
                  "Coimbatore",
                  "Madurai",
                  "Tiruchirappalli",
                  "Salem",
                  "Erode",
                  "Tirunelveli",
                  "Vellore",
                  "Thanjavur",
                  "Dindigul",
                  "Thoothukudi",
                  "Nagercoil",
                  "Karur",
                  "Cuddalore",
                  "Kanchipuram",
                  "Villupuram",
                  "Tiruppur",
                  "Nagapattinam",
                  "Sivakasi",
                  "Namakkal",
                ].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}

            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/FamilyLogin">Login</a>
          </p>
        </div>
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

export default FamSign;
