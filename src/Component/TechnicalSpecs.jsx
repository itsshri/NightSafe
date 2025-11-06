import { Route, Pause, MapPin, AlertTriangle } from "lucide-react";

export default function TechnicalSpecs() {
  const systemInfo = [
    { label: "AI Model Status", value: "Active", color: "text-success-500" },
    { label: "GPS Accuracy", value: "±3 meters", color: "text-slate-200" },
    { label: "Data Source", value: "Real-time GPS", color: "text-slate-200" },
    { label: "Platform", value: "React Native", color: "text-slate-200" },
    { label: "Emergency APIs", value: "SMS, Email, Telegram", color: "text-slate-200" }
  ];

  const modules = [
    {
      name: "Route Deviation Detection",
      status: "Implemented & Active",
      icon: Route,
      color: "green",
      statusColor: "bg-green-500"
    },
    {
      name: "Abnormal Halt Detection", 
      status: "In Development",
      icon: Pause,
      color: "blue",
      statusColor: "bg-yellow-500"
    },
    {
      name: "Danger Zone Proximity",
      status: "Planned",
      icon: MapPin,
      color: "red", 
      statusColor: "bg-red-400"
    },
    {
      name: "Emergency Alert System",
      status: "Partially Implemented",
      icon: AlertTriangle,
      color: "red",
      statusColor: "bg-red-500"
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8" data-testid="technical-specs">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
        <div className="space-y-4">
          {systemInfo.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-b-0" data-testid={`system-info-${index}`}>
              <span className="text-slate-400">{item.label}</span>
              <span className={`font-medium ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Detection Modules</h3>
        <div className="space-y-4">
          {modules.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg" data-testid={`module-${index}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-${module.color}-500 bg-opacity-20 rounded-lg flex items-center justify-center`}>
                    <IconComponent className={`text-${module.color}-500 w-4 h-4`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-200">{module.name}</p>
                    <p className="text-xs text-slate-400">{module.status}</p>
                  </div>
                </div>
                <div className={`w-2 h-2 ${module.statusColor} rounded-full`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}