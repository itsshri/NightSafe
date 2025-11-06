// src/components/Dashboard.jsx
import React, { useState } from "react";
import ShareLocation from "./ShareLocation";
import FriendsMap from "./FriendsMap";
import AppHeader from "./AppHeader";

function MapDashboard() {
  const [sharing, setSharing] = useState(false);
  const userId = "ShrijithR"; // replace with logged-in user
  const friends = ["FriendA", "FriendB"]; // static friend IDs

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
    <AppHeader/>
    

      <main className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <ShareLocation userId={userId} sharing={sharing} setSharing={setSharing} />
        <FriendsMap friendIds={friends} />
      </main>

      <footer className="text-center text-xs py-4 text-gray-500 border-t border-gray-800">
        &copy; {new Date().getFullYear()} NightSafety | Built with ❤️ by Shrijith
      </footer>
    </div>
    </>
  );
}

export default MapDashboard;
