export const PLAN_LIST = [
  {
    id: "free",
    name: "Free",
    storage: "5 GB",
    badge: null,
    desc: "Perfect for getting started",
    color: "gray",
    monthly: { price: 0,   amount: 0       },
    yearly:  { price: 0,   amount: 0       },
    features: [
      "5 GB Cloud Storage",
      "Basic file sync",
      "Web access only",
      "Standard support",
    ],
    cta: "Start Free",
  },
  {
    id: "plan_Si1gZRtrnRwauf",
    name: "Basic",
    storage: "50 GB",
    badge: null,
    desc: "Great for everyday personal use",
    color: "slate",
    monthly: { price: 99,  amount: 9900    },
    yearly:  { price: 79,  amount: 94800   },
    features: [
      "50 GB Cloud Storage",
      "Multi-device sync",
      "Basic file sharing",
      "Email support",
    ],
    cta: "Choose Basic",
  },
  {
    id: "plan_ShbAnQqzVwui43",
    name: "Pro",
    storage: "200 GB",
    badge: "Most Popular",
    desc: "Best for regular users",
    color: "blue",
    monthly: { price: 199, amount: 19900   },
    yearly:  { price: 159, amount: 190800  },
    features: [
      "200 GB Cloud Storage",
      "Faster sync speeds",
      "Priority support",
      "Advanced file sharing",
      "Mobile app access",
      "File version history",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "plan_Si1g6y6HLTrVjZ",
    name: "Premium",
    storage: "2 TB",
    badge: null,
    desc: "Advanced tools for professionals",
    color: "dark",
    monthly: { price: 399, amount: 39900   },
    yearly:  { price: 319, amount: 382800  },
    features: [
      "2 TB Cloud Storage",
      "Maximum sync speed",
      "24/7 Dedicated support",
      "Team collaboration",
      "1-year version history",
      "API access",
    ],
    cta: "Go Professional",
  },
];
 
/** Return price object for a given plan + billing period */
export function getPricing(plan, billing) {
  return plan[billing]; // { price, amount }
}
 
/** Format INR number with commas */
export function fmtINR(n) {
  return n.toLocaleString("en-IN");
}