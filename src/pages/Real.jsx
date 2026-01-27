import { ShieldCheck } from "lucide-react";

import { MapView } from "./MapView";
import { Side } from "./Side";
import { SOSButton } from "../pages/SOSButton";
import { useDestination } from "../pages/DestinationContext";
import { DestinationCard } from "../pages/DestinationCard";
import AppHeader from "../Component/AppHeader";

export default function Real() {
  const { destination } = useDestination();
  

  return (
    <> 
    <div className="min-h-screen w-full bg-slate-950 flex">
      
      {/* ✅ STATIC SIDEBAR (ALWAYS VISIBLE) */}
      <Side isOpen={true} onClose={() => {}} />

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 ml-80 py-8 px-4">
        <div>


    <AppHeader/>
        </div>
        <header className="w-full max-w-[1080px] flex items-center mb-8">
          <div className="flex items-center gap-3">
            {/* <ShieldCheck className="h-11 w-11 text-primary" /> */}
            {/* <div>
              <h1 className="text-2xl font-black text-white">
                NIGHTSAFE
              </h1>
              <p className="text-[20px] text-muted-foreground uppercase">
                Protected by Protocol Active
              </p>
            </div> */}
          </div>
        </header>

        <section className="w-full flex justify-center mb-8">
          <MapView destination={destination} />
        </section>

        <DestinationCard />
      </main>
    </div>
    </>
  );
}
