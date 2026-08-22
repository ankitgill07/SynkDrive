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
      "1 GB Cloud Storage",
      "Basic file sync",
      "Web access only",
      "Standard support",
    ],
    cta: "Start Free",
  },
  {
    id: "plan_Si1gZRtrnRwauf",
    name: "Basic",
    storage: "25 GB",
    badge: null,
    desc: "Great for everyday personal use",
    color: "slate",
    monthly: { price: 99,  amount: 9900    },
    yearly:  { price: 79,  amount: 94800   },
    features: [
      "25 GB storage",
      "Access from 2 devices",
      "Basic file sharing",
      "File upload limit: 2 GB per file",
      "60 days to restore deleted files",
      "Basic security",
      "Email support",
    ],
    cta: "Choose Basic",
  },
  {
    id: "plan_ShbAnQqzVwui43",
    name: "Pro",
    storage: "80 GB per user",
    badge: "Most Popular",
    desc: "Best for regular users",
    color: "blue",
    monthly: { price: 199, amount: 19900   },
    yearly:  { price: 159, amount: 190800  },
    features: [
      "80 GB storage per user",
      "Access from 4 devices",
      "Password protect files",
      "File upload limit: 6 GB per file",
      "120 days to restore deleted files",
      "Priority upload/download speed",
      "Email & live chat support",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "plan_Si1g6y6HLTrVjZ",
    name: "Premium",
    storage: "200 GB per user",
    badge: null,
    desc: "Advanced tools for professionals",
    color: "dark",
    monthly: { price: 399, amount: 39900   },
    yearly:  { price: 319, amount: 382800  },
    features: [
      "200 GB storage per user",
      "Access from up to 5 devices",
      "Password protect files",
      "File upload limit: 10 GB per file",
      "180 days to restore deleted files",
      "Priority upload/download speed",
      "24/7 phone, chat & email support",
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