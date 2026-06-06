import { useEffect, useState } from "react";
import { fmtINR } from "./Plans";
 
export default function FailedPage({ plan, billing, errorMsg, onRetry, onChangePlan }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 50); return () => clearTimeout(t); }, []);
 
  const isYear = billing === "yearly";
  const price = plan[billing].price;
  const total = isYear ? price * 12 : price;
 
  const failureReasons = [
    { icon: "💳", text: "Insufficient balance or credit limit" },
    { icon: "🔐", text: "OTP verification failed" },
    { icon: "📶", text: "Network connection was interrupted" },
    { icon: "⏱",  text: "Payment session timed out" },
  ];
 
  return (
    <div
      className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-4 py-10"
      style={{ animation: show ? "fadeIn 0.4s ease forwards" : "none" }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes shakeX {
          0%,100%{ transform:translateX(0) }
          20%    { transform:translateX(-8px) }
          40%    { transform:translateX(8px) }
          60%    { transform:translateX(-5px) }
          80%    { transform:translateX(5px) }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>
 
      <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden">
 
        {/* ── Top error band ── */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 px-8 pt-10 pb-8 text-center relative">
          {/* X circle */}
          <div
            className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4"
            style={{
              animation: show ? "shakeX 0.5s ease 0.2s" : "none",
            }}
          >
            ✕
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            Payment Failed
          </h2>
          <p className="text-red-200 text-sm leading-relaxed">
            We couldn't process your payment for the{" "}
            <strong className="text-white">{plan.name}</strong> plan.
          </p>
        </div>
 
        {/* ── Body ── */}
        <div
          className="px-7 py-6"
          style={{
            animation: show ? "slideUp 0.4s ease 0.15s backwards" : "none",
          }}
        >
 
          {/* Error message */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <p className="text-red-700 text-sm font-semibold">{errorMsg}</p>
            </div>
          )}
 
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            <strong className="text-gray-800">No amount was deducted</strong> from your account.
            You can try again with the same or different payment method.
          </p>
 
          {/* Possible reasons */}
          <div className="bg-[#F7F5F2] rounded-2xl overflow-hidden mb-5">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest px-5 py-3 border-b border-white">
              Possible Reasons
            </p>
            {failureReasons.map((r, i, arr) => (
              <div
                key={r.text}
                className={`flex items-center gap-3 px-5 py-3 text-sm text-gray-600 ${
                  i < arr.length - 1 ? "border-b border-white" : ""
                }`}
              >
                <span className="text-lg">{r.icon}</span>
                {r.text}
              </div>
            ))}
          </div>
 
          {/* Tips card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-amber-900 text-sm leading-relaxed">
              <strong className="font-bold">💡 Try these tips:</strong>
              <br />
              • Ensure your card/account has sufficient balance
              <br />
              • Try UPI or net banking as an alternative
              <br />
              • Wait 5 minutes and try again
              <br />
              • Contact your bank if the issue persists
            </p>
          </div>
 
          {/* Order summary mini */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Attempted Plan</p>
                <p className="text-sm font-black text-gray-800">{plan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Amount</p>
                <p className="text-lg font-black text-gray-800">₹{fmtINR(total)}</p>
              </div>
            </div>
          </div>
 
          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onChangePlan}
              className="py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-black text-sm hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-[0.97]"
            >
              ← Change Plan
            </button>
            <button
              onClick={onRetry}
              className="py-3.5 rounded-xl bg-[#155dfc] hover:bg-blue-700 text-white font-black text-sm transition-all active:scale-[0.97] shadow-lg shadow-blue-200"
            >
              Try Again →
            </button>
          </div>
 
          <p className="text-center text-[11px] text-gray-300 mt-4">
            Still having issues?{" "}
            <span className="text-[#155dfc] font-semibold cursor-pointer hover:underline">
              Contact support
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}