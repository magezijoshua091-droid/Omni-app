import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, Upload, Image as ImageIcon, File as FileIcon, Download, Trash2, Loader2, Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "../components/ui/button";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

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
    if (type.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-blue-500" />;
    if (type === "application/pdf") return <FileText className="w-8 h-8 text-red-500" />;
    return <FileIcon className="w-8 h-8 text-gray-500" />;
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

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Files</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{files.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Used</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {formatSize(files.reduce((acc, f) => acc + f.size, 0))}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white uppercase">{user?.role}</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Files</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and process your documents</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none w-full md:w-64"
            />
          </div>
          <Link to="/upload">
            <Button className="gap-2">
              <Upload className="w-4 h-4" /> Upload
            </Button>
          </Link>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No files found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {searchTerm ? "Try a different search term" : "Upload your first file to get started"}
          </p>
          {!searchTerm && (
            <Link to="/upload" className="mt-6 inline-block">
              <Button variant="outline">Upload File</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-950 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {filteredFiles.map((file) => (
              <li key={file.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatSize(file.size)}</span>
                      <span>•</span>
                      <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        file.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        file.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 
                        file.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {file.status}
                      </span>
                      {file.metadata?.savings && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          Saved {file.metadata.savings}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'COMPLETED' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(file.id)}
                      className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
