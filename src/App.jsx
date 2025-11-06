import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import LiveTrackingMap2 from "./Component/LiveTrackingMap2"; 
import MapDashboard from "./Component/MapDashboard";
import FamilyLogin from "./Component/FamilyLogin";
import FamSign from "./Component/FamSign";
import Home from "./Component/Home";
import { Navigation } from "lucide-react";
import LiveRouteView from "./Component/LiveRouteView";
import SafeCabVerification from "./Component/SafeCabVerification";
import FindCabs from "./Component/FindCabs";
import Lognav from "./Component/Lognav";
import Lognav2 from "./Component/Lognav2";
import AdvancedSafetyMap from "./Component/AdvancedSafetyMap";

import { useEffect } from "react"; // ✅ make sure useEffect is imported
import { ref, set } from "firebase/database";
import { db } from "./firebaseConfig"; // ✅ adjust path if needed



// ✅ All your routes
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map" component={LiveTrackingMap2} />
      <Route path="/FamilyLogin" component={FamilyLogin} />
      <Route path="/famsign" component={FamSign} />
      <Route path="/home" component={Home} />
      <Route path="/mapdashboard" component={MapDashboard} />
      <Route path="/liverouteview" component={LiveRouteView}/>
      <Route path="/safecab" component={SafeCabVerification}/>
      <Route path="/findcabs" component={FindCabs}/>
      <Route path="/asm" component={AdvancedSafetyMap}/> 
      <Route path="/lognav" component={Lognav}/>
      <Route path="/lognav2" component={Lognav2}/> 
      <Route component={NotFound} />
    </Switch>
  );
}

// ✅ Main App
function App() {
  useEffect(() => {
    // Test write to confirm Firebase works
    set(ref(db, "testWrite/debug"), { ok: true, t: Date.now() })
      .then(() => console.log("✅ Firebase write test succeeded"))
      .catch((e) => console.error("❌ Firebase write test failed:", e));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-slate-900 text-slate-100">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
