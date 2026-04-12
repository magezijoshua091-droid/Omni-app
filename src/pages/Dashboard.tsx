import { useState } from "react";
import { Link } from "react-router";
import { FileText, Upload, Image as ImageIcon, File as FileIcon, Download, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";

// Mock data for preview
const mockFiles = [
  { id: "1", name: "Q3_Financial_Report.pdf", type: "application/pdf", size: 2450000, status: "COMPLETED", createdAt: "2023-10-25T10:00:00Z" },
  { id: "2", name: "hero-banner-raw.png", type: "image/png", size: 8200000, status: "PROCESSING", createdAt: "2023-10-26T14:30:00Z" },
  { id: "3", name: "meeting-notes.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 150000, status: "COMPLETED", createdAt: "2023-10-27T09:15:00Z" },
];

export default function Dashboard() {
  const [files, setFiles] = useState(mockFiles);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and process your documents</p>
        </div>
        <Link to="/upload">
          <Button className="gap-2">
            <Upload className="w-4 h-4" /> Upload File
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {files.map((file) => (
            <li key={file.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{formatSize(file.size)}</span>
                    <span>•</span>
                    <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      file.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      file.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {file.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.status === 'COMPLETED' && (
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                    <Download className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
