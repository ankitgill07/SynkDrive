import logo from "../../assets/images/logo.png";
import { useEffect, useState } from "react";
import { Download, Copy, Edit2, Info, X } from "lucide-react";
import { getShareWithLinkApi } from "@/api/shareApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { formatSize, formatTimestamp } from "@/utils/Helpers";
import ShareFilePreview, {
  getFileExtension,
  getFileType,
} from "@/utils/ShareFilePreview";

export default function FileSharePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareFileData, setShareFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();
  const token = new URLSearchParams(window.location.search).get("token");

  const handleGetFileData = async () => {
    setIsLoading(true);
    setErrorMessage("");
    const result = await getShareWithLinkApi(id, token);
    if (result.success) {
      setShareFileData(result.data);
    } else {
      const message = result?.message || "Unable to open this shared file.";
      setErrorMessage(message);
      toast.error(message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetFileData();
  }, [id, token]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!shareFileData?.url) return;
    window.open(shareFileData.url, "_blank", "noopener,noreferrer");
  };

  const ext = getFileExtension(shareFileData);
  const fileType = getFileType(ext);
  const isAccessible = shareFileData?.isAccessible !== false;

  return (
    <div className="flex h-screen flex-col bg-[#F7F5F2]">
      <header className="sticky top-0 z-40 border-b border-slate-200/50 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className=" w-10 ">
              <img className=" rounded-lg object-cover" src={logo} alt="" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold font-plusjakartaSans text-slate-900 truncate">
                {shareFileData?.name || "Shared file"}
              </h1>
              <p className="text-sm font-inter text-slate-500 truncate">
                Shared by {shareFileData?.sharedBy || "Unknown"}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 font-inter">
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:inline-flex bg-[#d9d4cc3b] items-center gap-2 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-[#e9e8e8] duration-300  rounded-md cursor-pointer transition-all"
                title="View more information"
              >
                <Info className="w-4 h-4" />
                <span className="hidden md:inline">More Info</span>
              </button>

              {shareFileData?.permission === "editor" && (
                <button
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 bg-[#d9d4cc3b] text-sm font-medium text-slate-900 hover:bg-[#e9e8e8] duration-300  rounded-md cursor-pointer transition-all"
                  title="Rename file"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden md:inline">Rename</span>
                </button>
              )}

              <button
                onClick={handleCopyLink}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300
    ${
      isCopied
        ? "bg-green-100 text-green-700"
        : "bg-[#d9d4cc3b] text-slate-700 hover:bg-[#e9e8e8]"
    }`}
                title="Copy share link"
              >
                <Copy
                  className={`w-4 h-4 ${isCopied ? "text-green-600" : ""}`}
                />
                <span className="hidden md:inline">
                  {isCopied ? "Link Copied!" : "Copy Link"}
                </span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!shareFileData?.url || !isAccessible}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:shadow-none"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="sm:hidden inline-flex items-center justify-center p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#F7F5F2] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <p className="text-sm font-medium text-slate-500">Loading preview...</p>
        ) : errorMessage || !isAccessible ? (
          <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Link unavailable</h2>
            <p className="mt-2 text-sm text-slate-500">
              {errorMessage || "This public share link has been disabled."}
            </p>
          </div>
        ) : (
          <ShareFilePreview file={shareFileData} />
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2.5 hover:bg-slate-100 rounded-xl transition-colors duration-200 z-10"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">File Details</h2>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  File Name
                </p>
                <p className="text-sm font-medium text-slate-900 break-all">
                  {shareFileData?.name || "Shared file"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    File Size
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {Number.isFinite(shareFileData?.size)
                      ? formatSize(shareFileData.size)
                      : "Unknown"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    File Type
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {ext.toUpperCase()} {fileType}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Upload Date
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {shareFileData?.createdAt
                    ? formatTimestamp(shareFileData.createdAt)
                    : "Unknown"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Shared By
                </p>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {shareFileData?.sharedBy || "Unknown"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {shareFileData?.sharedByEmail || "Public link"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed">
                  This file was shared with you. You can download it, but cannot
                  edit or delete it.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50/50 to-white border-t border-slate-100 rounded-b-3xl flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                disabled={!shareFileData?.url || !isAccessible}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:shadow-none"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
