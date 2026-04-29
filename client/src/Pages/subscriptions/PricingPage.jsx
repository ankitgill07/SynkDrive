"use client";

import { useState } from "react";
import Header from "./Header";
import BillingToggle from "./BillingToggle";
import PricingCard from "./PricingCard";
import SubscriptionModal from "./SubscriptionModal";
import { Cloud, Zap, CheckCircle2, Share2 } from "lucide-react";

const pricingPlans = [
  {
    id: "free",
    title: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    description: "Basic storage for personal use",
    features: ["Limited storage", "Basic file sync", "Standard support"],
    buttonText: "Start Free",
    isPopular: false,
    isFeatured: true,
    buttonVariant: "outline",
  },
  {
    id: "plan_Si1gZRtrnRwauf",
    title: "Basic",
    priceMonthly: 99,
    priceYearly: 7990,
    description: "Balanced plan for everyday use",
    features: ["Moderate storage", "Multi-device sync", "Basic sharing"],
    buttonText: "Choose Standard",
    isPopular: false,
    isFeatured: false,
    buttonVariant: "outline",
  },
  {
    id: "plan_ShbAnQqzVwui43",
    title: "Pro",
    priceMonthly: 199,
    priceYearly: 4990,
    description: "Best for regular users",
    features: ["Increased storage", "Faster sync", "Priority support"],
    buttonText: "Upgrade to Plus",
    isPopular: true,
    isFeatured: false,
    buttonVariant: "filled",
    badge: "MOST POPULAR",
  },
  {
    id: "plan_Si1g6y6HLTrVjZ",
    title: "Premium",
    priceMonthly: 399,
    priceYearly: 12990,
    description: "Advanced tools for professionals",
    features: [
      "High storage capacity",
      "Advanced sharing controls",
      "Version history",
    ],
    buttonText: "Go Professional",
    isPopular: false,
    isFeatured: false,
    buttonVariant: "filled",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const handlePlanClick = (planId) => {
    if (planId !== "free") {
      setSelectedPlan(planId);
      setModalOpen(true);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center px-4 py-12 relative">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mb-6">
          <h1
            className="text-4xl font-bold text-black"
            style={{ fontFamily: "var(--font-plus-jakarta, sans-serif)" }}
          >
            Choose Your Storage Plan
          </h1>
          <p
            className="text-black/60 text-lg mt-4"
            style={{ fontFamily: "var(--font-inter, sans-serif)" }}
          >
            Simple, transparent pricing designed for every level of storage
            needs.
          </p>
        </div>

        <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <div className="w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanClick(plan.id)}
                className={plan.id !== "free" ? "cursor-pointer" : ""}
              >
                <PricingCard
                  {...plan}
                  price={isYearly ? plan.priceYearly : plan.priceMonthly}
                  billingPeriod={isYearly ? "/year" : "/month"}
                  billedLabel={isYearly ? "billed annually" : ""}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
