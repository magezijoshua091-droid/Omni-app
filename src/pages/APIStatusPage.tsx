import { CheckCircle2, AlertTriangle, Clock, Activity } from "lucide-react";

export default function APIStatusPage() {
  const systems = [
    { name: "API Gateway", status: "operational", uptime: "99.99%" },
    { name: "Authentication Service", status: "operational", uptime: "100%" },
    { name: "File Processing Workers", status: "operational", uptime: "99.95%" },
    { name: "Database Cluster", status: "operational", uptime: "99.99%" },
    { name: "Storage (S3)", status: "operational", uptime: "100%" },
    { name: "CDN Edge", status: "operational", uptime: "100%" }
  ];

  const incidents = [
    {
      date: "April 8, 2026",
      title: "Scheduled Maintenance",
      status: "Resolved",
      description: "Database cluster upgrade completed successfully. No downtime was experienced."
    },
    {
      date: "March 22, 2026",
      title: "Processing Delay",
      status: "Resolved",
      description: "Increased latency in file processing due to high volume. Scaled workers to resolve."
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">System Status</h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time status of Omni services.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            All Systems Operational
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {systems.map((system, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{system.name}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {system.uptime} uptime
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                Operational
              </div>
            </div>
          ))}
        </div>

        {/* Activity Chart Placeholder */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            System Performance (Last 24h)
          </h2>
          <div className="h-48 w-full bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-end p-6 gap-1">
            {[...Array(48)].map((_, i) => (
              <div 
                key={i} 
                className="flex-grow bg-green-500/40 hover:bg-green-500 transition-colors rounded-t-sm" 
                style={{ height: `${Math.floor(Math.random() * 40) + 60}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* Past Incidents */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Past Incidents</h2>
          <div className="space-y-8">
            {incidents.map((incident, idx) => (
              <div key={idx} className="relative pl-8 border-l-2 border-gray-100 dark:border-gray-800 pb-8 last:pb-0">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-800 border-4 border-white dark:border-gray-950"></div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm font-bold text-gray-400">{incident.date}</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-bold text-gray-500 uppercase">
                    {incident.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{incident.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
