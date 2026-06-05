import { useEffect, useState } from "react";
import { fmtINR } from "./plans";
import { Link } from "react-router-dom";

const CONFETTI_COLORS = [
  "#155dfc",
  "#fbbf24",
  "#34d399",
  "#f87171",
  "#a78bfa",
  "#60a5fa",
  "#fb923c",
  "#e879f9",
  "#22d3ee",
];

export default function SuccessPage({
  plan,
  billing,
  user,
  txnId,
  onDashboard,
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const isYear = billing === "yearly";
  const price = plan[billing].price;
  const total = isYear ? price * 12 : price;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const receiptId = txnId || "FREE-" + Date.now();

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* ── Confetti dots ── */}
      {CONFETTI_COLORS.map((color, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: 8 + (i % 3) * 5,
            height: 8 + (i % 3) * 5,
            borderRadius: i % 2 ? "50%" : 3,
            background: color,
            top: -20,
            left: `${6 + i * 10}%`,
            animation: show
              ? `confettiFall ${1.1 + i * 0.13}s ease-out ${i * 0.07}s forwards`
              : "none",
            opacity: 0,
          }}
        />
      ))}

      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(0)    rotate(0deg)   scale(1);   opacity: 1; }
          100% { transform: translateY(140px) rotate(720deg) scale(0.3); opacity: 0; }
        }
        @keyframes popIn {
          0%   { opacity:0; transform: scale(0.82) translateY(24px); }
          65%  { transform: scale(1.03) translateY(-4px); }
          100% { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes checkBounce {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[480px] overflow-hidden"
        style={{
          animation: show
            ? "popIn 0.5s cubic-bezier(.34,1.2,.64,1) both"
            : "none",
        }}
      >
        {/* ── Top hero band ── */}
        <div className="bg-[#155dfc] px-8 pt-10 pb-8 text-center relative">
          {/* Check circle */}
          <div
            className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4"
            style={{
              animation: show
                ? "checkBounce 0.55s cubic-bezier(.34,1.56,.64,1) 0.25s both"
                : "none",
            }}
          >
            ✓
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-1">
            Payment Successful!
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed">
            Your <strong className="text-white">{plan.name}</strong> plan is now
            active.
            {plan.price > 0 && ` ₹${fmtINR(total)} received.`}
          </p>
        </div>


        <div className="px-7 py-6">

          <div className="bg-[#F7F5F2] rounded-2xl overflow-hidden mb-5">
            {[
              { label: "Plan", value: plan.name },
              { label: "Storage", value: plan.storage },
              { label: "Billing cycle", value: isYear ? "Annual" : "Monthly" },
              ...(price > 0
                ? [
                    {
                      label: "Amount paid",
                      value: `₹${fmtINR(total)}`,
                      accent: true,
                    },
                  ]
                : [{ label: "Amount paid", value: "Free", accent: false }]),
              { label: "Date", value: dateStr },
              { label: "Transaction", value: receiptId, mono: true },
              { label: "Account", value: user?.email || "" },
            ].map((row, i, arr) => (
              <div
                key={row.label}
                className={`flex items-center justify-between px-5 py-3 text-sm ${
                  i < arr.length - 1 ? "border-b border-white" : ""
                }`}
              >
                <span className="text-gray-400 font-medium">{row.label}</span>
                <span
                  className={`font-bold ${
                    row.accent ? "text-[#155dfc]" : "text-gray-800"
                  } ${row.mono ? "font-mono text-xs tracking-wide" : ""}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {[
              { icon: "📁", label: "Upload files", sub: "Start syncing" },
              { icon: "📱", label: "Mobile app", sub: "iOS & Android" },
              { icon: "🔗", label: "Share files", sub: "With anyone" },
            ].map((t) => (
              <div
                key={t.label}
                className="bg-blue-50 rounded-xl p-3 text-center cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-[11px] font-bold text-[#155dfc]">
                  {t.label}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">{t.sub}</div>
              </div>
            ))}
          </div>
          <Link to={"/drive/home"}>
            <button
              onClick={onDashboard}
              className="w-full py-4 bg-[#155dfc] hover:bg-blue-700 text-white font-black text-sm rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
            >
              Go to Dashboard →
            </button>
          </Link>

          <p className="text-center text-[11px] text-gray-300 mt-3">
            A confirmation email has been sent to {user?.email}
          </p>
        </div>
      </div>
    </div>
  );
}
