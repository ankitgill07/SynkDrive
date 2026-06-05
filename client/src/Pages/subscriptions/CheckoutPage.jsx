import { useState } from "react";
import { PLAN_LIST, getPricing, fmtINR } from "./plans";
import { loadRazorpaySDK, openRazorpayPopup } from "../../utils/Razorpay";
import { createSubscriptionApi } from "@/api/SubscriptionApi";
import { userAuth } from "@/contextApi/AuthContext";
import { toast } from "sonner";

export default function CheckoutPage({
  initialPlan,
  initialBilling,
  onBack,
  onSuccess,
  onFailed,
}) {
  // ── Local state (can be changed without going back) ─────────────────────
  const [plan, setPlan] = useState(initialPlan);
  const [billing, setBilling] = useState(initialBilling);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showPlanPicker, setShowPlanPicker] = useState(false);

  const { price, amount } = getPricing(plan, billing);
  const isFree = price === 0;
  const isYear = billing === "yearly";
  const monthlyPrice = PLAN_LIST.find((p) => p.id === plan.id).monthly.price;
  const yearlyPrice = PLAN_LIST.find((p) => p.id === plan.id).yearly.price;
  const annualTotal = isYear ? yearlyPrice * 12 : monthlyPrice * 12;
  const annualPaid = isYear ? price * 12 : price * 12;
  const yearlySaving = monthlyPrice * 12 - yearlyPrice * 12;
  const displayTotal = isYear ? price * 12 : price;

  const { user } = userAuth();

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      e.phone = "Enter a valid 10-digit number";
    return e;
  }

  async function handlePay() {
    setPaying(true);
    try {
      const result = await createSubscriptionApi(plan.id);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      openRazorpayPopup({
        subscriptionId: result.data.subscriptionId,
        userId: user.id,
        razorpayMode: "test",
        plan,
        billing,
        onSuccess,
        onFailed,
      });
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  }

  function Field({ id, label, type = "text", optional = false }) {
    return (
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
          {label} {!optional && <span className="text-red-400">*</span>}
        </label>
        <input
          type={type}
          placeholder={label}
          value={form[id]}
          onChange={(e) => {
            setForm({ ...form, [id]: e.target.value });
            setErrors({ ...errors, [id]: "" });
          }}
          className={`
            w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-900
            border transition-all outline-none
            focus:border-[#155dfc] focus:ring-2 focus:ring-blue-100
            ${errors[id] ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}
          `}
        />
        {errors[id] && (
          <p className="text-red-500 text-[11px] font-semibold mt-1">
            {errors[id]}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* ══════════════════════════════════════════
            LEFT — FORM
        ══════════════════════════════════════════ */}
        <div>
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-400 font-semibold hover:text-gray-700 transition-colors mb-7"
          >
            ← Back to plans
          </button>

          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
            {isFree ? "Activate Free Plan" : "Complete Your Order"}
          </h2>
          <p className="text-sm text-gray-400 mb-7">
            {isFree
              ? "No payment needed — just confirm your details."
              : "Secured by Razorpay · 256-bit SSL encryption"}
          </p>

          {/* Contact details card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm space-y-4">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">
              Contact Details
            </p>
            <Field id="name" label="Full Name" />
            <Field id="email" label="Email Address" type="email" />
            <Field id="phone" label="Phone Number" type="tel" optional />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer mb-6 select-none">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={`
                mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center
                transition-all
                ${agreed ? "bg-[#155dfc] border-[#155dfc]" : "bg-white border-gray-300"}
              `}
            >
              {agreed && (
                <span className="text-white text-[9px] font-black">✓</span>
              )}
            </button>
            <span className="text-sm text-gray-500 leading-relaxed">
              I agree to the{" "}
              <span className="text-[#155dfc] font-semibold">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-[#155dfc] font-semibold">
                Privacy Policy
              </span>
            </span>
          </label>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={paying || (!isFree && !agreed)}
            className={`
              w-full py-4 rounded-2xl text-[15px] font-black tracking-tight
              flex items-center justify-center gap-2.5 transition-all duration-150
              ${
                paying || (!isFree && !agreed)
                  ? "bg-blue-200 text-white cursor-not-allowed"
                  : "bg-[#155dfc] text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200"
              }
            `}
          >
            {paying ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Opening Razorpay…
              </>
            ) : isFree ? (
              "Activate Free Plan →"
            ) : (
              `Pay ₹${fmtINR(displayTotal)} ${isYear ? "/ year" : "/ month"} →`
            )}
          </button>

          {!isFree && (
            <p className="text-center text-[11px] text-gray-300 mt-3">
              🔒 Your card is never stored by SynkDrive
            </p>
          )}
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — ORDER SUMMARY + PLAN & BILLING SWITCHERS
        ══════════════════════════════════════════ */}
        <div className="space-y-4">
          {/* ── Billing Period Switcher ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-3">
              Billing Period
            </p>
            <div className="flex bg-gray-50 rounded-xl p-1 gap-1">
              {[
                { key: "monthly", label: "Monthly", sub: null },
                { key: "yearly", label: "Yearly", sub: "Save 20%" },
              ].map(({ key, label, sub }) => (
                <button
                  key={key}
                  onClick={() => setBilling(key)}
                  className={`
                    flex-1 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200
                    flex flex-col items-center gap-0.5
                    ${
                      billing === key
                        ? "bg-[#155dfc] text-white shadow-md shadow-blue-200"
                        : "text-gray-400 hover:text-gray-700"
                    }
                  `}
                >
                  {label}
                  {sub && (
                    <span
                      className={`text-[10px] font-bold ${billing === key ? "text-blue-200" : "text-green-500"}`}
                    >
                      {sub}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Plan Switcher ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
                Selected Plan
              </p>
              <button
                onClick={() => setShowPlanPicker(!showPlanPicker)}
                className="text-[11px] font-bold text-[#155dfc] hover:underline"
              >
                {showPlanPicker ? "Close" : "Change"}
              </button>
            </div>

            {/* Current plan chip */}
            <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-black text-gray-900">{plan.name}</p>
                <p className="text-xs text-gray-400">{plan.storage} storage</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-[#155dfc]">
                  ₹{getPricing(plan, billing).price}
                  <span className="text-xs font-semibold text-gray-400">
                    /mo
                  </span>
                </p>
              </div>
            </div>

            {/* Plan picker dropdown */}
            {showPlanPicker && (
              <div className="mt-3 space-y-2">
                {PLAN_LIST.map((p) => {
                  const { price: pp } = getPricing(p, billing);
                  const isActive = p.id === plan.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPlan(p);
                        setShowPlanPicker(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl
                        border text-left transition-all
                        ${
                          isActive
                            ? "border-[#155dfc] bg-blue-50"
                            : "border-gray-100 bg-gray-50 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`
                          w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                          ${isActive ? "border-[#155dfc] bg-[#155dfc]" : "border-gray-300"}
                        `}
                        >
                          {isActive && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {p.storage}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-gray-700">
                        {pp === 0 ? "Free" : `₹${pp}/mo`}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Price Breakdown ── */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6">
              {/* Features */}
              {plan.features.map((f, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2.5 py-1.75 text-[13px] text-gray-700 ${
                    i < plan.features.length - 1
                      ? "border-b border-gray-100 pb-1.75"
                      : ""
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[#155dfc] flex items-center justify-center text-[8px] font-black flex-shrink-0">
                    ✓
                  </span>
                  {f}
                </div>
              ))}

              {/* Billing breakdown */}
              {!isFree && (
                <div className="bg-[#F7F5F2] rounded-xl p-4 mt-4">
                  <div className="flex justify-between text-[13px] text-gray-500 mb-2">
                    <span>Billing</span>
                    <span className="font-bold text-gray-900 capitalize">
                      {billing}
                    </span>
                  </div>
                  <div className="flex justify-between text-[13px] text-gray-500 mb-2">
                    <span>
                      ₹{getPricing(plan, billing).price} ×{" "}
                      {isYear ? "12 months" : "1 month"}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{fmtINR(displayTotal)}
                    </span>
                  </div>
                  {yearlySaving > 0 && (
                    <div className="flex justify-between text-[13px] text-green-600 font-bold mb-2">
                      <span>Annual discount</span>
                      <span>– ₹{fmtINR(yearlySaving)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2.5 mt-2 border-t-[1.5px] border-gray-200">
                    <span className="text-[15.5px] font-black text-gray-900">
                      Total due today
                    </span>
                    <span className="text-[15.5px] font-black text-[#155dfc]">
                      ₹{fmtINR(displayTotal)}
                    </span>
                  </div>
                </div>
              )}

              {isFree && (
                <div className="bg-green-100 rounded-xl p-3 mt-4 text-center">
                  <p className="text-sm font-black text-green-800">
                    ✦ No payment required
                  </p>
                </div>
              )}

              <p className="text-[11px] text-gray-300 text-center mt-3.5 leading-relaxed">
                Cancel or change plan anytime from Settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
