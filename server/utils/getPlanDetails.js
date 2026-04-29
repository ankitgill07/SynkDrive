const GB = 1024 ** 3;

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    storageBytes: 1 * GB,
    maxDevices: 1,
    maxFileSizeBytes: 200 * 1024 ** 2,
    restoreFileDays: 30,
  },
  {
    id: "plan_Si1gZRtrnRwauf",
    name: "Basic",
    price: 99,
    priceCurrency: "INR",
    billingCycle: "monthly",
    storageBytes: 25 * GB,
    maxDevices: 2,
    maxFileSizeBytes: 4 * GB,
    restoreFileDays: 60,
  },
  {
    id: "plan_ShbAnQqzVwui43",
    name: "Pro",
    price: 199,
    priceCurrency: "INR",
    billingCycle: "monthly",
    storageBytes: 80 * GB,
    maxDevices: 4,
    maxFileSizeBytes: 8 * GB,
    restoreFileDays: 120,
  },
  {
    id: "plan_Si1g6y6HLTrVjZ",
    name: "Premium",
    price: 399,
    priceCurrency: "INR",
    billingCycle: "monthly",
    storageBytes: 200 * GB,
    maxDevices: 8,
    maxFileSizeBytes: 15 * GB,
    restoreFileDays: 180,
  },
];

export const getPlanById = (id) => PLANS.find((plan) => plan.id === id);

