"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { TopHeader } from "../settings/top-header";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import useSubscription from "@/hooks/useSubscription";
import { formatSize, formatTimestamp } from "@/utils/Helpers";
import SubscriptionModal from "@/models/SubscriptionModal";

export default function SubscriptionManagePage() {
  const {
    setModal,
    modal,
    subscriptionData,
    handlePausedSubscription,
    handleResumedSubscription,
  } = useSubscription();

  const totalStorage = subscriptionData?.user?.totalStorage;
  const availableStorage = subscriptionData?.user?.usedStorage?.size;

  const percentage = Math.min((availableStorage / totalStorage) * 100, 100);

  const connected = subscriptionData?.user?.devicesConnected || 0;
  const max = subscriptionData?.user?.maxDeviceLimit || 1;

  const widthPercentage = `${(connected / max) * 100}%`;

  const getStatusPill = () => {
    if (subscriptionData.status === "active") {
      return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50">
          <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
          <span className="font-medium text-sm text-green-600">Active</span>
        </span>
      );
    }
    if (subscriptionData.status === "paused") {
      return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          <span className="font-medium text-sm text-amber-600">Paused</span>
        </span>
      );
    }
    if (subscriptionData.status === "cancelled") {
      return (
        <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50">
          <span className="w-2 h-2 rounded-full bg-red-600"></span>
          <span className="font-medium text-sm text-red-600">Cancelled</span>
        </span>
      );
    }
  };

  return (
    <div className="bg-[#f5f5f0] min-h-screen">
      <div className="sticky top-0 z-50">
        <TopHeader />
      </div>
      <div className="mx-auto px-12 py-8">
        <div
          className="min-h-screen px-12 py-12"
          style={{ backgroundColor: "#f5f5f0" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-100">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                  Subscription
                </h1>
                <p className="text-sm text-slate-500">
                  Manage your plan and billing
                </p>
              </div>
              {getStatusPill()}
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 mb-8">
              <div className="grid grid-cols-2 gap-12 mb-8 pb-8 border-b border-gray-100">
                <div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <CreditCard size={24} color="#155dfc" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {subscriptionData.planName}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-900">
                      ₹{subscriptionData.planPrice}
                    </span>
                    <span className="text-sm text-slate-500 ml-1">/month</span>
                  </div>
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full">
                    {subscriptionData.billingCycle} billing
                  </span>
                </div>

                <div className="text-right space-y-6">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Current period
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {formatTimestamp(subscriptionData.currentBillingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Next billing</p>
                    <p className="text-sm font-medium text-blue-600">
                      {formatTimestamp(subscriptionData.nextBillingDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Member since</p>
                    <p className="text-sm font-medium text-slate-900">
                      Jan 15, 2025
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link to={"/plan"}>
                  <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all">
                    <ArrowUpCircle size={16} />
                    Upgrade Plan
                  </button>
                </Link>

                {subscriptionData.status === "active" && (
                  <button
                    onClick={() => setModal("pause")}
                    className="flex items-center gap-2 px-5 py-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 active:scale-95 transition-all"
                  >
                    <PauseCircle size={16} />
                    Pause Subscription
                  </button>
                )}

                {subscriptionData.status === "paused" && (
                  <button
                    onClick={() => setModal("resume")}
                    className="flex items-center gap-2 px-5 py-3 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 active:scale-95 transition-all"
                  >
                    <PlayCircle size={16} />
                    Resume Subscription
                  </button>
                )}

                {subscriptionData.status === "cancelled" && (
                  <button className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all">
                    <RefreshCw size={16} />
                    Reactivate Plan
                  </button>
                )}

                {subscriptionData?.status !== "cancelled" && (
                  <button
                    onClick={() => setModal("cancel")}
                    className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 active:scale-95 transition-all"
                  >
                    <XCircle size={16} />
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
                Usage overview
              </p>
              <div className="bg-white border border-gray-200 rounded-3xl grid grid-cols-2 overflow-hidden">
                {/* Storage */}
                <div className="p-8 border-r border-b border-gray-100">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <HardDrive size={20} color="#155dfc" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Storage
                      </p>
                      <p className="text-xl font-bold text-slate-900 mt-2">
                        {formatSize(availableStorage)} /{" "}
                        {formatSize(totalStorage)}
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 "
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {formatSize(totalStorage - availableStorage)} remaining
                  </p>
                </div>

                {/* Devices */}
                <div className="p-8 border-b border-gray-100">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Monitor size={20} color="#155dfc" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Devices
                      </p>
                      <p className="text-xl font-bold text-slate-900 mt-2">
                        {subscriptionData?.user?.devicesConnected} /{" "}
                        {subscriptionData?.user?.maxDeviceLimit} connected
                      </p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 "
                      style={{ width: widthPercentage }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {Math.max(max - connected, 0)} slots available
                  </p>
                </div>

                {/* Max File Size */}
                <div className="p-8 border-r border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Upload size={20} color="#155dfc" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Max file size
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        {formatSize(subscriptionData?.user?.maxFileUploadSize)}
                        <span className="text-sm text-slate-400 ml-1">
                          per file
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Restore Window */}
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield size={20} color="#155dfc" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Restore deleted files
                      </p>
                      <p className="text-2xl font-bold text-slate-900 mt-2">
                        {subscriptionData?.user?.fileRestoreTime} days
                        <span className="text-sm text-slate-400 ml-1">
                          recovery
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 - Billing History */}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
                Billing history
              </p>
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Date
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Plan
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Amount
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionData?.invoice?.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <td className="px-8 py-4 text-sm text-slate-900">
                          {format(new Date(row?.paid_at * 1000), "dd MMMM yy")}
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-900">
                          {row.planName}
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-slate-900">
                          {row.amount_paid / 100}
                        </td>
                        <td className="px-8 py-4 text-sm">
                          <span className="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-sm">
                          <button
                            onClick={() => window.open(row.short_url, "_blank")}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:underline font-normal transition-colors"
                          >
                            <Download size={14} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <SubscriptionModal
            setModal={setModal}
            modal={modal}
            handlePausedSubscription={handlePausedSubscription}
            handleResumedSubscription={handleResumedSubscription}
            subscriptionData={subscriptionData}
          />
        </div>
      </div>
    </div>
  );
}
