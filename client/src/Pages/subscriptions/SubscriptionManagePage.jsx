"use client";

import React from "react";
import {
  CreditCard,
  HardDrive,
  Monitor,
  Shield,
  Upload,
  Download,
  PauseCircle,
  XCircle,
  PlayCircle,
  ArrowUpCircle,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import { TopHeader } from "../settings/top-header";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useSubscription from "@/hooks/useSubscription";
import { formatSize, formatTimestamp } from "@/utils/Helpers";
import SubscriptionModal from "@/models/SubscriptionModal";
import { userAuth } from "@/contextApi/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

export default function SubscriptionManagePage() {
  const navigate = useNavigate();
  const { user } = userAuth();
  const {
    setModal,
    modal,
    subscriptionData,
    loading,
    handlePausedSubscription,
    handleResumedSubscription,
    handleCancelSubscription,
  } = useSubscription();

  useEffect(() => {
    if (!loading) {
      const hasPlan = user?.hasActiveSubscription || user?.subscriptionsId || (subscriptionData && subscriptionData.status !== "free" && subscriptionData.status !== "cancelled");
      if (!hasPlan) {
        toast.error("Please upgrade your plan to access subscription management.");
        navigate("/drive/home", { replace: true });
      }
    }
  }, [loading, subscriptionData, user, navigate]);

  if (loading) {
    return (
      <div className="bg-[#f5f5f0] min-h-screen">
        <div className="sticky top-0 z-50">
          <TopHeader />
        </div>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
          <div className="max-w-4xl mx-auto">
            {/* Page Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-96 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* Plan Card Skeleton */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-2xl animate-pulse" />
                  <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="space-y-4 md:text-right flex flex-col md:items-end">
                  <div className="space-y-2">
                    <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              {/* Buttons Skeleton */}
              <div className="flex gap-3 flex-wrap">
                <div className="h-11 w-36 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-11 w-44 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Usage overview Skeleton */}
            <div className="mb-8">
              <div className="h-4 w-36 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="bg-white border border-gray-200 rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-sm">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-8 border-b border-gray-100 last:border-b-0 md:even:border-l">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    {(i === 1 || i === 2) && (
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-100 rounded-full w-full animate-pulse" />
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Billing History Skeleton */}
            <div>
              <div className="h-4 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm space-y-4">
                <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-12 w-full bg-gray-50 rounded-lg animate-pulse" />
                <div className="h-12 w-full bg-gray-50 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalStorage = subscriptionData?.user?.totalStorage || 1024 * 1024 * 1024;
  const availableStorage = subscriptionData?.user?.usedStorage?.size || 0;

  const percentage = totalStorage > 0 ? Math.min((availableStorage / totalStorage) * 100, 100) : 0;

  const connected = subscriptionData?.user?.devicesConnected || 1;
  const max = subscriptionData?.user?.maxDeviceLimit || 1;

  const widthPercentage = `${Math.min((connected / max) * 100, 100)}%`;

  const getStatusPill = () => {
    const status = subscriptionData?.status || "free";
    if (status === "active") {
      return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
          <span className="font-medium text-sm text-green-700">Active</span>
        </span>
      );
    }
    if (status === "paused") {
      return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          <span className="font-medium text-sm text-amber-700">Paused</span>
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span className="font-medium text-sm text-red-700">Cancelled</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
        <span className="font-medium text-sm text-blue-700">Free Tier</span>
      </span>
    );
  };

  const isFree = !subscriptionData || subscriptionData.status === "free" || subscriptionData.status === "cancelled";
  const isActive = subscriptionData?.status === "active";
  const isPaused = subscriptionData?.status === "paused";

  return (
    <div className="bg-[#f5f5f0] min-h-screen">
      <div className="sticky top-0 z-50">
        <TopHeader />
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                Subscription & Billing
              </h1>
              <p className="text-sm text-slate-500">
                Manage your plan, quotas, payment methods, and invoices
              </p>
            </div>
            {getStatusPill()}
          </div>

          {/* Plan Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-[#155dfc]">
                  <CreditCard size={26} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {subscriptionData?.planName || "Free Tier"}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-extrabold text-slate-900">
                    ₹{subscriptionData?.planPrice ?? 0}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">/month</span>
                </div>
                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
                  {subscriptionData?.billingCycle || "Standard"} billing
                </span>
              </div>

              <div className="space-y-4 md:text-right">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Current period
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {subscriptionData?.currentBillingDate
                      ? formatTimestamp(subscriptionData.currentBillingDate)
                      : "Active"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    Next billing date / Due date
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    {subscriptionData?.nextBillingDate
                      ? formatTimestamp(subscriptionData.nextBillingDate)
                      : "No upcoming billing (Free Plan)"}
                  </p>
                </div>
                {subscriptionData?.daysUntilRenewal !== null &&
                  subscriptionData?.daysUntilRenewal !== undefined && (
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                        Days until renewal
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatTimestamp(subscriptionData.daysUntilRenewal)} days remaining
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link to="/plan">
                <button className="flex items-center gap-2 px-5 py-3 bg-[#155dfc] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200">
                  <ArrowUpCircle size={16} />
                  {isFree ? "Upgrade to Pro" : "Change Plan"}
                </button>
              </Link>

              {isActive && (
                <button
                  onClick={() => setModal("pause")}
                  className="flex items-center gap-2 px-5 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm font-semibold hover:bg-amber-100 active:scale-95 transition-all"
                >
                  <PauseCircle size={16} />
                  Pause Subscription
                </button>
              )}

              {isPaused && (
                <button
                  onClick={() => setModal("resume")}
                  className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-sm font-semibold hover:bg-emerald-100 active:scale-95 transition-all"
                >
                  <PlayCircle size={16} />
                  Resume Subscription
                </button>
              )}

              {!isFree && (
                <button
                  onClick={() => setModal("cancel")}
                  className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 active:scale-95 transition-all"
                >
                  <XCircle size={16} />
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>

          {/* Usage overview */}
          <div className="mb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Usage & Quotas
            </p>
            <div className="bg-white border border-gray-200 rounded-3xl grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-sm">
              {/* Storage */}
              <div className="p-8 border-b md:border-r border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#155dfc]">
                    <HardDrive size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Cloud Storage
                    </p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                      {formatSize(availableStorage)} / {formatSize(totalStorage)}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-[#155dfc] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {formatSize(Math.max(totalStorage - availableStorage, 0))} remaining
                </p>
              </div>

              {/* Devices */}
              <div className="p-8 border-b border-gray-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#155dfc]">
                    <Monitor size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Connected Devices
                    </p>
                    <p className="text-xl font-bold text-slate-900 mt-1">
                      {connected} / {max} active
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-[#155dfc] rounded-full transition-all duration-500"
                    style={{ width: widthPercentage }}
                  ></div>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {Math.max(max - connected, 0)} device slots available
                </p>
              </div>

              {/* Max File Size */}
              <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#155dfc]">
                    <Upload size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Max Single File Size
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {formatSize(subscriptionData?.user?.maxFileUploadSize || 200 * 1024 * 1024)}
                      <span className="text-sm text-slate-400 font-normal ml-1">
                        / file
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Restore Window */}
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-[#155dfc]">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Deleted Files Recovery
                    </p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {subscriptionData?.user?.fileRestoreTime || 30} days
                      <span className="text-sm text-slate-400 font-normal ml-1">
                        window
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History & Invoices */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Invoices & Billing History
            </p>
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
              {subscriptionData?.invoice && subscriptionData.invoice.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Invoice
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionData.invoice.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                        >
                          <td className="px-8 py-4 text-sm text-slate-900 font-medium">
                            {row?.paid_at
                              ? format(new Date(row.paid_at * 1000), "dd MMMM yyyy")
                              : "Recent"}
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-800">
                            {row.planName || "Storage Plan"}
                          </td>
                          <td className="px-8 py-4 text-sm font-bold text-slate-900">
                            ₹{(row.amount_paid / 100).toFixed(0)}
                          </td>
                          <td className="px-8 py-4 text-sm">
                            <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200 capitalize">
                              {row.status || "Paid"}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-sm">
                            {row.short_url ? (
                              <button
                                onClick={() => window.open(row.short_url, "_blank")}
                                className="flex items-center gap-1.5 text-[#155dfc] hover:text-blue-700 font-semibold hover:underline transition-colors"
                              >
                                <Download size={14} />
                                Download PDF
                              </button>
                            ) : (
                              <span className="text-slate-400 text-xs">Generated</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <ReceiptText size={24} />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-1">
                    No Invoices Yet
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {isFree
                      ? "You are currently on the Free tier. When you upgrade, your tax invoices and receipts will appear here."
                      : "Your invoices will appear here once your billing cycle is processed."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        <SubscriptionModal
          setModal={setModal}
          modal={modal}
          handlePausedSubscription={handlePausedSubscription}
          handleResumedSubscription={handleResumedSubscription}
          handleCancelSubscription={handleCancelSubscription}
          subscriptionData={subscriptionData}
        />
      </div>
    </div>
  );
}

