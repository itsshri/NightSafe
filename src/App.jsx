import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import LiveTrackingMap2 from "./Component/LiveTrackingMap2"; 
import MapDashboard from "./Component/MapDashboard";

// import TravelStatusWrapper from "./components/TravelStatusWrapper";
import { Navigation } from 'lucide-react';
import FamilyLogin from "./Component/FamilyLogin";
import FamSign from "./Component/FamSign";
import Home from "./Component/Home";

function Router() {
  return (
  <Switch>
      <Route path="/" component={FamilyLogin} />
      

      <Route path="/map" component={LiveTrackingMap2} /> {/* ✅ new route */}
      <Route path="/FamilyLogin" component={FamilyLogin}/>
      <Route path="/famsign" component={FamSign}/>
      <Route path="/home" component={Home}/>
      <Route path="/mapdashboard" component={MapDashboard}/>
      <Route component={NotFound} />
      
    </Switch>
  );
}

function App() {
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