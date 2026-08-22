import React, { createContext, useContext, useState } from "react";
import { X, Download } from "lucide-react";
import { formatSize, renderFilePreview } from "@/utils/Helpers";
import { getDownloadUrlApi } from "@/api/fileApi";
import { axiosInstance } from "@/api/AxiosInstance";
import { toast } from "sonner";
import { IoMusicalNotes } from "react-icons/io5";

const FilePreviewContext = createContext(null);

export const getFileTypeGroup = (extension, fileName) => {
  let ext = (extension || "").toLowerCase().replace(".", "");
  if (!ext && fileName) {
    const parts = fileName.split(".");
    if (parts.length > 1) {
      ext = parts.pop().toLowerCase();
    }
  }
  
  const groups = {
    image: ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "bmp"],
    video: ["mp4", "webm", "ogg", "mov", "mkv", "avi"],
    audio: ["mp3", "wav", "ogg", "m4a", "aac", "flac"],
    pdf: ["pdf"],
    text: ["txt", "md", "json", "js", "jsx", "ts", "tsx", "css", "html", "csv", "xml"]
  };

  for (const [group, extensions] of Object.entries(groups)) {
    if (extensions.includes(ext)) return group;
  }
  return "other";
};

export const FilePreviewProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");

  const previewFile = async (fileObj) => {
    if (!fileObj || !fileObj._id) return;
    setFile(fileObj);
    setIsOpen(true);
    setLoading(true);
    setTextContent("");
    setPreviewUrl("");

    try {
      // Get preview URL
      const response = await axiosInstance.get(`/file/${fileObj._id}?json=true`);
      const url = response.data.previewUrl;
      setPreviewUrl(url);

      // If text file, fetch content
      const group = getFileTypeGroup(fileObj.extension, fileObj.name);
      if (group === "text") {
        try {
          const textRes = await fetch(url);
          if (!textRes.ok) throw new Error("CORS or Network error fetching text file");
          const text = await textRes.text();
          setTextContent(text);
        } catch (fetchErr) {
          console.warn("Fetch text failed, using iframe fallback:", fetchErr);
          setTextContent(null);
        }
      }
    } catch (error) {
      console.error("Preview error:", error);
      toast.error("Failed to load file preview");
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    try {
      const res = await getDownloadUrlApi(file._id);
      if (res?.downloadUrl) {
        const a = document.createElement("a");
        a.href = res.downloadUrl;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        toast.error("Failed to get download URL");
      }
    } catch (err) {
      toast.error("Error downloading file");
    }
  };

  return (
    <FilePreviewContext.Provider value={{ previewFile }}>
      {children}
      {isOpen && file && (
        <div className="fixed inset-0 z-50 bg-[#F7F5F2]/95 flex flex-col backdrop-blur-md animate-in fade-in duration-200">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 text-gray-900 bg-white shadow-sm shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 bg-gray-100 p-2 rounded-lg border border-gray-200">
                {renderFilePreview({ file, size: 20 })}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate max-w-[200px] sm:max-w-md" title={file.name}>
                  {file.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{formatSize(file.size)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 hover:text-[#155dfc] transition-all cursor-pointer text-gray-700 border border-gray-200"
                title="Download file"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 hover:text-red-500 transition-all cursor-pointer text-gray-700 border border-gray-200"
                title="Close preview"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 min-h-0 relative">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-500 text-xs font-medium">Generating preview...</p>
              </div>
            ) : (
              (() => {
                const group = getFileTypeGroup(file.extension, file.name);
                if (group === "image" && previewUrl) {
                  return (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl border border-gray-200"
                    />
                  );
                }
                if (group === "video" && previewUrl) {
                  return (
                    <video
                      controls
                      autoPlay
                      src={previewUrl}
                      className="max-h-[75vh] max-w-full rounded-lg shadow-2xl border border-gray-200"
                    />
                  );
                }
                if (group === "audio" && previewUrl) {
                  return (
                    <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 p-8 rounded-2xl shadow-xl w-full max-w-md">
                      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <IoMusicalNotes size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-900 font-semibold truncate max-w-[280px]">{file.name}</p>
                        <p className="text-gray-500 text-xs mt-1">{formatSize(file.size)}</p>
                      </div>
                      <audio controls autoPlay src={previewUrl} className="w-full mt-4" />
                    </div>
                  );
                }
                if (group === "pdf" && previewUrl) {
                  return (
                    <iframe
                      src={previewUrl}
                      className="w-full max-w-4xl h-[75vh] rounded-lg shadow-2xl border border-gray-200 bg-white"
                      title={file.name}
                    />
                  );
                }
                if (group === "text") {
                  if (textContent !== null) {
                    return (
                      <div className="w-full max-w-4xl h-[75vh] bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center text-xs text-gray-500 font-mono shrink-0">
                          <span className="truncate max-w-[250px]">{file.name}</span>
                          <span>TEXT PREVIEW</span>
                        </div>
                        <pre className="flex-1 p-6 overflow-auto text-left text-gray-800 bg-white font-mono text-sm leading-relaxed whitespace-pre-wrap select-text">
                          {textContent}
                        </pre>
                      </div>
                    );
                  } else {
                    return (
                      <iframe
                        src={previewUrl}
                        className="w-full max-w-4xl h-[75vh] rounded-lg shadow-2xl border border-gray-200 bg-white"
                        title={file.name}
                      />
                    );
                  }
                }
                return (
                  <div className="flex flex-col items-center gap-6 bg-white border border-gray-200 p-10 rounded-2xl shadow-2xl max-w-md w-full">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
                      {renderFilePreview({ file, size: 48 })}
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-gray-900 font-bold text-lg truncate max-w-[300px]">{file.name}</h4>
                      <p className="text-gray-500 text-sm">Preview not available for this file type</p>
                      <p className="text-gray-400 text-xs">{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
                    >
                      Download File
                    </button>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </FilePreviewContext.Provider>
  );
};

export const useFilePreview = () => {
  const context = useContext(FilePreviewContext);
  if (!context) {
    throw new Error("useFilePreview must be used within FilePreviewProvider");
  }
  return context;
};
