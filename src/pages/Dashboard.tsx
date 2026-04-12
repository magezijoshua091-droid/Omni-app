import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { 
  FileText, Upload, Image as ImageIcon, File as FileIcon, 
  Download, Trash2, Loader2, Search, Filter, MoreVertical,
  Zap, Shield, HardDrive, Users, Activity, Bell, Settings,
  ArrowUpRight, CheckCircle2, Clock, Sparkles
} from "lucide-react";
import { Button } from "../components/ui/button";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "motion/react";

interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  status: "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  url: string;
  metadata?: {
    originalSize?: number;
    processedSize?: number;
    savings?: number;
    action?: string;
  };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const fetchFiles = async () => {
    try {
      const res = await api.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-6 h-6 text-blue-500" />;
    if (type === "application/pdf") return <FileText className="w-6 h-6 text-red-500" />;
    return <FileIcon className="w-6 h-6 text-gray-500" />;
  };

  const handleDownload = async (fileId: string) => {
    try {
      const res = await api.get(`/files/${fileId}/download`);
      window.open(res.data.downloadUrl, "_blank");
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStorage = files.reduce((acc, f) => acc + f.size, 0);
  const storageLimit = user?.role === "PRO" ? 5 * 1024 * 1024 * 1024 : 50 * 1024 * 1024;
  const storagePercentage = Math.min(100, (totalStorage / storageLimit) * 100);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-gray-950">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-grow max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search your files, documents, media..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-gray-500 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm text-gray-500 hover:text-blue-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{user?.role} Plan</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20">
                {user?.email?.[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Welcome Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-[#FFF5E9] dark:bg-blue-900/10 rounded-[32px] p-8 md:p-10"
            >
              <div className="relative z-10 max-w-md">
                <h2 className="text-3xl font-bold text-[#8B5E3C] dark:text-blue-400 mb-2">Hello, {user?.email?.split('@')[0]}!</h2>
                <p className="text-[#A68B76] dark:text-gray-400 text-lg mb-6">
                  Your intelligent workspace is ready. You have saved <span className="font-bold text-[#8B5E3C] dark:text-blue-400">1.2GB</span> of storage this week.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-[#8B5E3C] dark:text-blue-400 shadow-sm">
                    <Activity className="w-4 h-4" />
                    +24% Productivity
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 md:w-80 md:h-80 opacity-20 md:opacity-100 pointer-events-none">
                <img 
                  src="https://picsum.photos/seed/workspace/400/400" 
                  alt="Illustration" 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Workspace Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Workspace</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-500">View All</Button>
                  <Link to="/upload">
                    <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                      <Upload className="w-4 h-4 mr-2" /> New File
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Images", count: files.filter(f => f.type.startsWith('image/')).length, icon: ImageIcon, color: "bg-blue-500" },
                  { label: "Documents", count: files.filter(f => f.type === 'application/pdf').length, icon: FileText, color: "bg-purple-500" },
                  { label: "Processing", count: files.filter(f => f.status === 'PROCESSING').length, icon: Clock, color: "bg-orange-500" },
                  { label: "Optimized", count: files.filter(f => f.metadata?.savings).length, icon: Sparkles, color: "bg-green-500" },
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{item.count}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* File List Table */}
            <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm overflow-hidden border border-gray-50 dark:border-gray-800">
              <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                <h4 className="font-bold text-gray-900 dark:text-white">File Management</h4>
                <Button variant="ghost" size="icon" className="text-gray-400"><Filter className="w-4 h-4" /></Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 dark:bg-gray-800/50">
                      <th className="px-6 py-4">File Name</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Size</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors">
                              {getFileIcon(file.type)}
                            </div>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-200 truncate max-w-[150px]">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            file.status === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            file.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}>
                            {file.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-medium">{formatSize(file.size)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {file.status === 'COMPLETED' && (
                              <Button variant="ghost" size="icon" onClick={() => handleDownload(file.id)} className="text-gray-400 hover:text-blue-600">
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar Section */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Storage Usage Widget */}
            <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-sm text-center">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Storage Usage</h4>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle className="text-gray-100 dark:text-gray-800 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                  <circle 
                    className="text-blue-600 stroke-current transition-all duration-1000" 
                    strokeWidth="10" 
                    strokeDasharray={`${storagePercentage * 2.51}, 251.2`}
                    strokeLinecap="round" 
                    fill="transparent" 
                    r="40" cx="50" cy="50" 
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{Math.round(storagePercentage)}%</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Used</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
                {formatSize(totalStorage)} of {formatSize(storageLimit)} used
              </p>
              <Link to="/pricing">
                <Button variant="outline" className="w-full rounded-2xl border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Upgrade Storage
                </Button>
              </Link>
            </div>

            {/* Team Members Section */}
            <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Workspace Members</h4>
                <Button variant="ghost" size="icon" className="text-gray-400"><Users className="w-4 h-4" /></Button>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Sarah Chen", role: "Admin", img: "https://i.pravatar.cc/150?u=sarah" },
                  { name: "James Wilson", role: "Editor", img: "https://i.pravatar.cc/150?u=james" },
                  { name: "Elena Rodriguez", role: "Viewer", img: "https://i.pravatar.cc/150?u=elena" },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={member.img} alt={member.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-6 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-none">
                Invite Member
              </Button>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 shadow-sm">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Processing Activity</h4>
              <div className="h-32 flex items-end gap-1">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-grow bg-blue-100 dark:bg-blue-900/30 rounded-t-lg hover:bg-blue-600 transition-colors"
                    style={{ height: `${Math.floor(Math.random() * 80) + 20}%` }}
                  ></div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Mon</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Sun</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
