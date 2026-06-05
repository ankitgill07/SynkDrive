import { formatTimestamp } from "@/utils/Helpers";
import { PauseCircle, XCircle } from "lucide-react";
import React from "react";

function SubscriptionModal({
  handlePausedSubscription,
  handleResumedSubscription,
  setModal,
  modal,
  subscriptionData
}) {
  return (
    <div>
      {modal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {modal === "pause" && (
              <>
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PauseCircle size={32} color="#d97706" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 text-center mb-4">
                  Pause your subscription?
                </h2>
                <p className="text-sm text-slate-600 text-center leading-relaxed mb-8">
                  Your plan pauses after{" "}
                  {formatTimestamp(subscriptionData?.nextBillingDate)} You keep
                  full Pro access until your billing period ends — no charges
                  during the pause.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 px-5 py-3 bg-white text-slate-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    Keep plan
                  </button>
                  <button
                    onClick={handlePausedSubscription}
                    className="flex-1 px-5 py-3 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 active:scale-95 transition-all"
                  >
                    Yes, pause it
                  </button>
                </div>
              </>
            )}

            {modal === "cancel" && (
              <>
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={32} color="#dc2626" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 text-center mb-4">
                  Cancel subscription?
                </h2>
                <p className="text-sm text-slate-600 text-center leading-relaxed mb-8">
                  Cancelling stops all future billing. You keep Pro access until
                  May 31, 2026. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 px-5 py-3 bg-white text-slate-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    Keep plan
                  </button>
                  <button
                    onClick={""}
                    className="flex-1 px-5 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 active:scale-95 transition-all"
                  >
                    Yes, cancel
                  </button>
                </div>
              </>
            )}

            {modal === "resume" && (
              <>
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <PlayCircle size={32} color="#059669" />
                </div>

                <h2 className="text-xl font-semibold text-slate-900 text-center mb-4">
                  Resume your subscription?
                </h2>

                <p className="text-sm text-slate-600 text-center leading-relaxed mb-8">
                  Your {subscriptionData?.planName} subscription will resume
                  immediately, and billing will continue from your next billing
                  cycle on {formatTimestamp(subscriptionData?.nextBillingDate)}.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setModal(null)}
                    className="flex-1 px-5 py-3 bg-white text-slate-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    Not now
                  </button>

                  <button
                    onClick={handleResumedSubscription}
                    className="flex-1 px-5 py-3 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    Yes, resume
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionModal;
