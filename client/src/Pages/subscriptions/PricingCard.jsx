import { createSubscriptionApi } from "@/api/SubscriptionApi";
import { Check, HardDrive, Zap, Headphones } from "lucide-react";

const getFeatureIcon = (feature) => {
  if (feature.toLowerCase().includes("storage")) return HardDrive;
  if (feature.toLowerCase().includes("sync")) return Zap;
  if (feature.toLowerCase().includes("support")) return Headphones;
  return Check;
};

export default function PricingCard({
  id,
  title,
  price,
  description,
  features,
  buttonText,
  isPopular,
  isFeatured = false,
  buttonVariant,
  billingPeriod,
  billedLabel,
  badge,
}) {
  const isFreeCard = isFeatured;
  const cardBorder = isPopular ? "border-[#155dfc]" : "border-black/10";
  const textColor = "text-black";
  const textMuted = "text-black/60";

  const handleCreateSubscription = async (planId) => {
    const result = await createSubscriptionApi(planId);
    handleOpenRazorPay({ subscriptionId: result.data.subscriptionId });
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 bg-[#faf9f7] ${cardBorder} ${
        !isFreeCard && !isPopular
          ? "hover:border-[#155dfc] hover:shadow-sm"
          : ""
      } ${isPopular ? "shadow-lg" : ""}`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-full ${
            badge === "Basic"
              ? "bg-[#155dfc] text-white"
              : "bg-[#155dfc] text-white"
          }`}
        >
          {badge}
        </div>
      )}

      <h3
        className={`text-xl font-bold mt-2 ${textColor}`}
        style={{ fontFamily: "var(--font-plus-jakarta, sans-serif)" }}
      >
        {title}
      </h3>

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span
          className={`text-4xl font-bold ${textColor}`}
          style={{ fontFamily: "var(--font-plus-jakarta, sans-serif)" }}
        >
          ₹{price.toFixed(0)}
        </span>
        <span
          className={`text-sm ${textMuted}`}
          style={{ fontFamily: "var(--font-inter, sans-serif)" }}
        >
          {billingPeriod}
        </span>
      </div>

      {/* Billed Label */}
      {billedLabel && (
        <p
          className="text-xs mt-1 text-black/50"
          style={{ fontFamily: "var(--font-inter, sans-serif)" }}
        >
          {billedLabel}
        </p>
      )}

      {/* Description */}
      <p
        className={`text-sm mt-3 ${textMuted}`}
        style={{ fontFamily: "var(--font-inter, sans-serif)" }}
      >
        {description}
      </p>

      {/* Features List */}
      <ul className="mt-6 space-y-3 flex-1">
        {features.map((feature, index) => {
          const IconComponent = getFeatureIcon(feature);
          return (
            <li key={index} className="flex items-start gap-3">
              <IconComponent className="w-4 h-4 text-[#155dfc] flex-shrink-0 mt-0.5" />
              <span
                className="text-sm text-black"
                style={{ fontFamily: "var(--font-inter, sans-serif)" }}
              >
                {feature}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Button */}
      <button
        onClick={() => handleCreateSubscription(id)}
        className={`w-full mt-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
          buttonVariant === "primary"
            ? "bg-white text-[#155dfc] hover:bg-white/90"
            : buttonVariant === "filled"
              ? "bg-[#155dfc] text-white hover:bg-[#0d3fc4]"
              : "border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/5"
        }`}
        style={{ fontFamily: "var(--font-inter, sans-serif)" }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export const handleOpenRazorPay = ({ subscriptionId }) => {
  const rzp = new window.Razorpay({
    key: import.meta.env.VITE_APP_RAZORPAY_API_KEY,
    name: "SynkDrive",
    subscription_id: subscriptionId,
    theme: {
      color: "#155dfc",
    },

    handler: async function (response) {
      console.log(response);
    },
  });
  rzp.open();
};
