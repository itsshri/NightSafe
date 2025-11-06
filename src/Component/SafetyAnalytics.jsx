import { Route, Clock, AlertTriangle, Shield } from "lucide-react";
import { useEffect, useState } from "react";

export default function SafetyAnalytics({ selectedCity }) {
  const [analytics, setAnalytics] = useState({
    totalDistance: "—",
    travelTime: "—",
    dangerZones: 0,
    safetyIncidents: 0,
    riskEvents: [],
  });

  useEffect(() => {
    if (!selectedCity) return;

    // 📍 Realistic analytics data for each area
    const locationAnalytics = {
      "RS Puram": {
        totalDistance: "4.2 km",
        travelTime: "2MIN",
        dangerZones: 1,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Crossed residential lane", time: "9:35 PM", risk: "Safe Zone", color: "green" },
          { description: "Near Bharathi Park junction", time: "9:40 PM", risk: "Low Risk", color: "yellow" },
        ],
      },
      "Gandhipuram": {
        totalDistance: "6.5 km",
        travelTime: "8MIN",
        dangerZones: 3,
        safetyIncidents: 1,
        riskEvents: [
          { description: "Approaching 100 Feet Road", time: "9:15 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Commercial stretch — crowd detected", time: "9:22 PM", risk: "High Risk", color: "red" },
          { description: "Bus stand area — surveillance active", time: "9:30 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Saibaba Colony": {
        totalDistance: "3.8 km",
        travelTime: "10MIN",
        dangerZones: 1,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Passing residential roads", time: "9:25 PM", risk: "Safe Zone", color: "green" },
          { description: "Low lighting detected on side road", time: "9:30 PM", risk: "Low Risk", color: "yellow" },
        ],
      },
      "Peelamedu": {
        totalDistance: "10.1 km",
        travelTime: "15MIN",
        dangerZones: 4,
        safetyIncidents: 2,
        riskEvents: [
          { description: "Crossing Avinashi Road", time: "9:45 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Market area — crowded", time: "9:55 PM", risk: "High Risk", color: "red" },
          { description: "Entering residential layout", time: "10:00 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Singanallur": {
        totalDistance: "12.4 km",
        travelTime: "30MIN",
        dangerZones: 3,
        safetyIncidents: 1,
        riskEvents: [
          { description: "Passing industrial area", time: "9:40 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Main signal congestion", time: "9:50 PM", risk: "High Risk", color: "red" },
        ],
      },
      "Coimbatore North": {
        totalDistance: "7.2 km",
        travelTime: "1MIN",
        dangerZones: 2,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Traffic near railway station", time: "9:40 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Well-lit intersection", time: "9:48 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Coimbatore South": {
        totalDistance: "8.6 km",
        travelTime: "20MIN",
        dangerZones: 3,
        safetyIncidents: 1,
        riskEvents: [
          { description: "Approaching market area", time: "9:32 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Police patrol spotted", time: "9:40 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Podanur": {
        totalDistance: "9.8 km",
        travelTime: "25MIN",
        dangerZones: 4,
        safetyIncidents: 2,
        riskEvents: [
          { description: "Railway crossing ahead", time: "9:20 PM", risk: "High Risk", color: "red" },
          { description: "Poor street lighting", time: "9:25 PM", risk: "Caution Zone", color: "yellow" },
        ],
      },
      "Race Course": {
        totalDistance: "3.1 km",
        travelTime: "10MIN",
        dangerZones: 0,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Joggers park stretch", time: "9:10 PM", risk: "Safe Zone", color: "green" },
          { description: "Well-lit boulevard", time: "9:15 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Vadavalli": {
        totalDistance: "4.6 km",
        travelTime: "30MIN",
        dangerZones: 1,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Hilly road — low visibility", time: "9:25 PM", risk: "Low Risk", color: "yellow" },
          { description: "Residential area secured", time: "9:30 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Eachanari": {
        totalDistance: "14.2 km",
        travelTime: "25MIN",
        dangerZones: 3,
        safetyIncidents: 2,
        riskEvents: [
          { description: "Truck movement detected", time: "9:50 PM", risk: "High Risk", color: "red" },
          { description: "Temple junction area", time: "10:00 PM", risk: "Medium Risk", color: "yellow" },
        ],
      },
      "Ukkadam": {
        totalDistance: "9.3 km",
        travelTime: "30MIN",
        dangerZones: 3,
        safetyIncidents: 1,
        riskEvents: [
          { description: "Crowded signal crossing", time: "9:45 PM", risk: "High Risk", color: "red" },
          { description: "Main junction cameras active", time: "9:50 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Kuniamuthur": {
        totalDistance: "7.8 km",
        travelTime: "30MIN",
        dangerZones: 2,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Passing local market", time: "9:32 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Crossed main road", time: "9:40 PM", risk: "Safe Zone", color: "green" },
        ],
      },
      "Kalapatti": {
        totalDistance: "11.2 km",
        travelTime: "20MIN",
        dangerZones: 3,
        safetyIncidents: 1,
        riskEvents: [
          { description: "Industrial route section", time: "9:42 PM", risk: "Medium Risk", color: "yellow" },
          { description: "Airport bypass road", time: "9:52 PM", risk: "Low Risk", color: "yellow" },
        ],
      },
      "Saravanampatti": {
        totalDistance: "13.1 km",
        travelTime: "25MIN",
        dangerZones: 3,
        safetyIncidents: 1,
        riskEvents: [
          { description: "IT corridor stretch", time: "9:30 PM", risk: "Safe Zone", color: "green" },
          { description: "Moderate traffic density", time: "9:40 PM", risk: "Medium Risk", color: "yellow" },
        ],
      },
      "Kovaipudur": {
        totalDistance: "8.9 km",
        travelTime: "25MIN",
        dangerZones: 2,
        safetyIncidents: 0,
        riskEvents: [
          { description: "Hill base road ahead", time: "9:25 PM", risk: "Low Risk", color: "yellow" },
          { description: "Local surveillance zone", time: "9:32 PM", risk: "Safe Zone", color: "green" },
        ],
      },
    };

    setAnalytics(locationAnalytics[selectedCity] || {
      totalDistance: "—",
      travelTime: "—",
      dangerZones: 0,
      safetyIncidents: 0,
      riskEvents: [{ description: "Waiting for location...", time: "--", risk: "Unknown", color: "gray" }],
    });
  }, [selectedCity]);

  const getRiskColor = (color) => {
    switch (color) {
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 transition-all hover:shadow-lg hover:scale-[1.01]">
        <h3 className="text-lg font-semibold text-white mb-6">Safety Analytics & Risk Assessment</h3>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[
            { icon: <Route className="text-green-500 w-8 h-8" />, label: "Total Distance", value: analytics.totalDistance },
            { icon: <Clock className="text-blue-500 w-8 h-8" />, label: "Travel Time", value: analytics.travelTime },
            { icon: <AlertTriangle className="text-yellow-500 w-8 h-8" />, label: "Danger Zones", value: analytics.dangerZones },
            { icon: <Shield className="text-green-500 w-8 h-8" />, label: "Safety Incidents", value: analytics.safetyIncidents },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-indigo-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <p className="text-2xl font-bold text-white">{item.value}</p>
              <p className="text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Risk Timeline */}
        <div className="bg-slate-700 rounded-lg p-4 shadow-inner">
          <h4 className="font-medium text-white mb-4">
            Risk Assessment Timeline – <span className="text-indigo-400">{selectedCity || "Select Area"}</span>
          </h4>
          <div className="space-y-3">
            {analytics.riskEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-3 h-3 ${getRiskColor(event.color)} rounded-full flex-shrink-0`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-200">{event.description}</p>
                    <span className="text-xs text-slate-400">{event.time}</span>
                  </div>
                  <p className="text-xs text-slate-400">{event.risk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
