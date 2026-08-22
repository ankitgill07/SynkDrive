import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HardDrive, ArrowLeft, Home, Compass, AlertCircle } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full text-center relative z-10">
        {/* Logo / Branding */}
        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full mb-8 shadow-2xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <HardDrive size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-plusjakartaSans">
            SynkDrive
          </span>
        </div>

        {/* 404 Visual Graphic */}
        <div className="relative mb-6">
          <h1 className="text-[120px] sm:text-[160px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 leading-none select-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-slate-900/80 border border-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center shadow-2xl text-purple-400">
              <Compass size={40} className="animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
          Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all duration-200 border border-white/10 flex items-center justify-center gap-2 backdrop-blur-md active:scale-95"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link to="/drive/home" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95">
              <Home size={18} />
              Return to Home
            </button>
          </Link>
        </div>

        {/* Support Note */}
        <p className="mt-12 text-xs text-slate-500">
          Need assistance? Feel free to contact our support team.
        </p>
      </div>
    </div>
  );
}
