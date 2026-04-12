import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File as FileIcon, X, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1
  });

  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload progress
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setUploading(false);
        setSuccess(true);
      }
    }, 200);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload File</h1>
        <p className="text-sm text-gray-500 mt-1">Upload a file to compress, convert, or analyze.</p>
      </div>

      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
          </p>
          <p className="text-sm text-gray-500 mt-2">or click to select from your computer</p>
          <p className="text-xs text-gray-400 mt-4">Supports PDF, JPG, PNG, DOCX up to 50MB</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <FileIcon className="w-8 h-8" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && !success && (
              <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Uploading...</span>
                <span className="font-medium text-gray-900">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Upload complete!</p>
                <p className="text-sm text-green-700 mt-1">Your file is ready for processing.</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-indigo-900">AI Suggestions</h3>
              </div>
              <p className="text-sm text-indigo-800 mb-4">We detected this is an image. Here's what you can do:</p>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                  Compress (Save ~40%)
                </Button>
                <Button variant="outline" className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50">
                  Convert to WebP
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            {!success ? (
              <>
                <Button variant="outline" onClick={() => setFile(null)} disabled={uploading}>Cancel</Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload File"}
                </Button>
              </>
            ) : (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
