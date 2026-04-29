import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.png";
import { Copy, Download, Edit2, Info, X } from "lucide-react";
import ShareFilePreview from "@/utils/ShareFilePreview";
import { getShareEmaileFileDataApi } from "@/api/shareApi";
import { useParams } from "react-router-dom";

function EmailSharePage() {
  const [fileData, setFileData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { fileId } = useParams();

  const token = new URLSearchParams(window.location.search).get("token");

  const handleGetFileData = async () => {
    const result = await getShareEmaileFileDataApi(fileId, token);
    if (result.success) {
      setFileData(result.data);
    } else {
      toast.error(result.message);
    }
  };

  useEffect(() => {
    handleGetFileData();
  }, [fileId, token]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fileData.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
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
                {fileData.name}
              </h1>
              <p className="text-sm font-inter text-slate-500 truncate">
                Shared by {fileData.sharedBy}
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

              {fileData.permission === "editor" && (
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

              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 active:scale-95">
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
        <ShareFilePreview file={fileData} />
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
            <div className="px-6 py-6 border-b border-slate-100 from-white to-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">File Details</h2>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  File Name
                </p>
                <p className="text-sm font-medium text-slate-900 break-all">
                  Project-Presentation-Q1-2024.pdf
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    File Size
                  </p>
                  <p className="text-sm font-bold text-slate-900">12.4 MB</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    File Type
                  </p>
                  <p className="text-sm font-bold text-slate-900">PDF</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  Upload Date
                </p>
                <p className="text-sm font-medium text-slate-900">
                  March 15, 2024 at 2:30 PM
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Shared By
                </p>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="w-8 h-8 rounded-full  from-blue-400 to-blue-600 " />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Sarah Johnson
                    </p>
                    <p className="text-xs text-slate-500">sarah@company.com</p>
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
            <div className="px-6 py-4 from-slate-50/50 to-white border-t border-slate-100 rounded-b-3xl flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2.5 text-sm font-semibold text-white  from-blue-600 to-blue-700 rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-200 active:scale-95">
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailSharePage;
