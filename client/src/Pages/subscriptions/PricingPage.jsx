import { useState } from "react";
import { PLAN_LIST, getPricing, fmtINR } from "./plans";
 
export default function PricingPage({ onSelectPlan }) {
  const [billing, setBilling] = useState("monthly");
 
  return (
    <div className="min-h-screen bg-[#F7F5F2]">
 
      {/* ── Hero ── */}
      <div className="text-center px-6 pt-14 pb-10 max-w-2xl mx-auto">
        <span className="inline-block bg-blue-50 text-[#155dfc] text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
          Simple Pricing
        </span>
 
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-[1.08] mb-4">
          Choose Your<br />
          <span className="text-[#155dfc]">Storage Plan</span>
        </h1>
        <p className="text-gray-500 text-base leading-relaxed mb-8">
          Transparent pricing for every level of storage need.
          No hidden fees. Cancel anytime.
        </p>
 
        {/* Billing toggle */}
        <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 gap-1 shadow-sm">
          {["monthly", "yearly"].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`
                px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200
                ${billing === b
                  ? "bg-[#155dfc] text-white shadow-md shadow-blue-200"
                  : "text-gray-400 hover:text-gray-700"}
              `}
            >
              {b === "monthly" ? "Monthly" : "Yearly"}
            </button>
          ))}
        </div>
 
        {billing === "yearly" && (
          <p className="text-green-600 text-sm font-bold mt-3">
            ✦ Save 20% with yearly billing
          </p>
        )}
      </div>
 
      {/* ── Plan Cards ── */}
      <div className="max-w-8xl mx-auto px-5 pb-20 flex flex-wrap justify-center gap-4 items-end">
        {PLAN_LIST.map((plan) => {
          const { price } = getPricing(plan, billing);
          const isPop = plan.badge === "Most Popular";
 
          return (
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan, billing)}
              className={`
                relative flex flex-col flex-1 min-w-[300px] max-w-[250px] rounded-2xl cursor-pointer
                transition-all duration-200 hover:-translate-y-1.5 group
                ${isPop
                  ? "bg-[#155dfc] shadow-2xl shadow-blue-300 -translate-y-3"
                  : "bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:shadow-blue-100"}
              `}
              style={{ padding: isPop ? "36px 24px 24px" : "24px" }}
            >
              {/* Popular badge */}
              {isPop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#155dfc] text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                  ★ Most Popular
                </div>
              )}
 
              {/* Plan name */}
              <p className={`text-base font-black mb-2 ${isPop ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </p>
 
              {/* Price */}
              <div className="flex items-baseline gap-1 mb-1.5">
                <span className={`text-4xl font-black tracking-tighter leading-none ${isPop ? "text-white" : "text-gray-900"}`}>
                  ₹{price}
                </span>
                {price > 0 && (
                  <span className={`text-xs mb-1 ${isPop ? "text-blue-200" : "text-gray-400"}`}>
                    /mo
                  </span>
                )}
              </div>
 
              <p className={`text-xs leading-relaxed mb-4 ${isPop ? "text-blue-200" : "text-gray-400"}`}>
                {plan.desc}
              </p>
 
              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className={`
                      w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0
                      ${isPop ? "bg-white/20 text-white" : "bg-blue-50 text-[#155dfc]"}
                    `}>✓</span>
                    <span className={`text-[12.5px] ${isPop ? "text-blue-100" : "text-gray-500"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
 
              {/* CTA */}
              <button
                onClick={(e) => { e.stopPropagation(); onSelectPlan(plan, billing); }}
                className={`
                  w-full py-3 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95
                  ${isPop
                    ? "bg-white text-[#155dfc] hover:bg-blue-50"
                    : "border-2 border-[#155dfc] text-[#155dfc] hover:bg-blue-50"}
                `}
              >
                {plan.cta} →
              </button>
            </div>
          );
        })}
      </div>
 
      {/* Trust bar */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-white border border-gray-100 rounded-2xl px-8 py-6 flex flex-wrap justify-center gap-8 shadow-sm">
          {[
            { icon: "🔒", label: "256-bit SSL", sub: "Secure payments" },
            { icon: "↩",  label: "7-day refund", sub: "No questions asked" },
            { icon: "📞", label: "24/7 support", sub: "Always available" },
            { icon: "⚡", label: "Instant setup", sub: "Ready in seconds" },
          ].map((t) => (
            <div key={t.label} className="text-center min-w-[80px]">
              <div className="text-xl mb-1">{t.icon}</div>
              <div className="text-xs font-bold text-gray-800">{t.label}</div>
              <div className="text-[11px] text-gray-400">{t.sub}</div>
            </div>
          ))}
        </div>
      </div>
 
    </div>
  );
}
 