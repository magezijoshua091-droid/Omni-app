import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File as FileIcon, X, CheckCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router";
import api from "../lib/api";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { GoogleGenAI } from "@google/genai";

export default function UploadPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{action: string, label: string}[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setSuccess(false);
      setError(null);
      setProgress(0);
      setSuggestions([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // 1. Get Presigned URL from our API
      const { data } = await api.post("/files/upload-url", {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const { uploadUrl, file: fileRecord } = data;
      setFileId(fileRecord.id);

      // 2. Upload directly to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percentCompleted);
        }
      });

      setSuccess(true);
      
      // 3. Analyze file with AI (Client-side Gemini)
      setAnalyzing(true);
      try {
        const ai = new GoogleGenAI({ apiKey: (process as any).env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Analyze this file metadata and suggest 2-3 processing actions (like compress, convert, enhance, OCR). 
          File Name: ${file.name}
          File Type: ${file.type}
          File Size: ${file.size} bytes
          
          Return ONLY a JSON array of objects with 'action' (slug) and 'label' (human readable) properties.
          Example: [{"action": "compress", "label": "Compress (Save 50%)"}]`
        });
        
        const text = response.text;
        if (text) {
          const aiSuggestions = JSON.parse(text.replace(/```json|```/g, "").trim());
          setSuggestions(aiSuggestions);
        } else {
          // Fallback to backend simple suggestions
          const analysisRes = await api.post(`/files/${fileRecord.id}/analyze`);
          setSuggestions(analysisRes.data.suggestions);
        }
      } catch (err) {
        console.error("AI Analysis failed, falling back to basic suggestions:", err);
        const analysisRes = await api.post(`/files/${fileRecord.id}/analyze`);
        setSuggestions(analysisRes.data.suggestions);
      } finally {
        setAnalyzing(false);
      }

    } catch (err: any) {
      console.error("Upload failed:", err);
      setError(err.response?.data?.error || "Failed to upload file. Please check your connection.");
    } finally {
      setUploading(false);
    }
  };

  const handleProcess = async (action: string) => {
    if (!fileId) return;
    try {
      await api.post(`/process/${fileId}`, { action });
      navigate("/dashboard");
    } catch (err) {
      console.error("Processing failed:", err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload File</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Upload a file to compress, convert, or analyze.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {!file ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
            isDragActive 
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" 
              : "border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700 bg-white dark:bg-gray-950"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Upload className="w-10 h-10" />
          </div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">
            {isDragActive ? "Drop the file here" : "Drag & drop a file here"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or click to select from your computer</p>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded">PDF</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded">Images</span>
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded">Docs</span>
            <span>Up to 50MB</span>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-950 shadow-sm rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                <FileIcon className="w-10 h-10" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && !success && (
              <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {uploading && (
            <div className="mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Uploading to secure storage...</span>
                <span className="font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-3 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-bold text-green-900 dark:text-green-400">Upload complete!</p>
                <p className="text-sm text-green-700 dark:text-green-500 mt-1">Your file has been safely stored in our encrypted cloud.</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-200" />
                <h3 className="font-bold text-xl">AI Intelligence Layer</h3>
              </div>
              
              {analyzing ? (
                <div className="flex items-center gap-3 text-blue-100">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p>Analyzing file content for optimizations...</p>
                </div>
              ) : (
                <>
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Our AI has analyzed your file. We recommend the following optimizations to improve performance and save space.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {suggestions.length > 0 ? suggestions.map((s, i) => (
                      <Button 
                        key={i}
                        onClick={() => handleProcess(s.action)}
                        className="bg-white text-blue-700 hover:bg-blue-50 border-none font-bold"
                      >
                        {s.label}
                      </Button>
                    )) : (
                      <p className="text-sm text-blue-200 italic">No specific optimizations suggested for this file type.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-10 flex justify-end gap-4">
            {!success ? (
              <>
                <Button variant="ghost" onClick={() => setFile(null)} disabled={uploading}>Cancel</Button>
                <Button onClick={handleUpload} disabled={uploading} className="px-8 h-11 font-bold">
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : "Start Upload"}
                </Button>
              </>
            ) : (
              <Link to="/dashboard">
                <Button variant="secondary" className="font-bold">Skip for now</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
