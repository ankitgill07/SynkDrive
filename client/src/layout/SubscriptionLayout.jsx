import CheckoutPage from "@/Pages/subscriptions/CheckoutPage";
import FailedPage from "@/Pages/subscriptions/FailedPage";
import Navbar from "@/Pages/subscriptions/Navbar";
import PricingPage from "@/Pages/subscriptions/PricingPage";
import SuccessPage from "@/Pages/subscriptions/SuccessPage";
import React, { useState } from "react";

export const STEPS = ["Select Plan", "Checkout", "Confirm"];

function SubscriptionLayout() {
  const [screen, setScreen] = useState("pricing");

  /** Selected plan object from PLAN_LIST (from data/plans.js) */
  const [selectedPlan, setSelectedPlan] = useState(null);

  /** Selected billing period: "monthly" | "yearly" */
  const [selectedBilling, setSelectedBilling] = useState("monthly");

  /** User form data { name, email, phone } from checkout */
  const [userData, setUserData] = useState(null);

  /** Transaction ID from Razorpay response */
  const [txnId, setTxnId] = useState(null);

  /** Error message (if payment fails) */
  const [errorMsg, setErrorMsg] = useState("");

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Called when user clicks a plan card in PricingPage.
   *
   * @param {object} plan - The plan object (from PLAN_LIST)
   * @param {string} billing - "monthly" or "yearly"
   *
   * Flow:
   *  1. Store the selected plan and billing period in state
   *  2. Navigate to checkout screen
   *  3. CheckoutPage will receive these as props and can show/allow changing them
   */
  function handleSelectPlan(plan, billing) {
    console.log("✓ Plan selected:", { planName: plan.name, billing });
    setSelectedPlan(plan);
    setSelectedBilling(billing);
    setScreen("checkout");
  }

  /**
   * Called from CheckoutPage when user clicks "Pay" button.
   *
   * @param {object} result
   * @param {object} result.plan - The plan (possibly changed in checkout)
   * @param {string} result.billing - The billing period (possibly changed in checkout)
   * @param {object} result.user - Form data { name, email, phone }
   * @param {string} result.txnId - Transaction ID (null for free plans)
   *
   * Flow:
   *  1. Store user data and transaction ID
   *  2. Navigate to success screen
   *  3. SuccessPage displays receipt
   */
  function handleSuccess(result) {
    console.log("✓ Payment success:", result);
    setSelectedPlan(result.plan);
    setSelectedBilling(result.billing);
    setUserData(result.user);
    setTxnId(result.txnId);
    setErrorMsg("");
    setScreen("success");
  }

  /**
   * Called from CheckoutPage when Razorpay payment fails or is dismissed.
   *
   * @param {object} result
   * @param {object} result.plan - The plan being paid for
   * @param {string} result.billing - The billing period
   * @param {object} result.user - Form data { name, email, phone }
   * @param {string} result.errorMsg - Error description from Razorpay
   *
   * Flow:
   *  1. Store the error message
   *  2. Navigate to failed screen
   *  3. FailedPage shows error + offers retry/change plan options
   */
  function handleFailed(result) {
    console.log("✗ Payment failed:", result);
    setSelectedPlan(result.plan);
    setSelectedBilling(result.billing);
    setUserData(result.user);
    setErrorMsg(result.errorMsg);
    setScreen("failed");
  }

  function handleRetry() {
    console.log("↻ Retrying payment...");
    setErrorMsg("");
    setScreen("checkout");
  }

  function handleBackToHome() {
    console.log("⌂ Returning to home...");
    setScreen("pricing");
    setSelectedPlan(null);
    setSelectedBilling("monthly");
    setUserData(null);
    setTxnId(null);
    setErrorMsg("");
  }

  return (
    <div className="bg-[#F7F5F2] min-h-screen">
      <Navbar
        currentStep={
          screen === "pricing"
            ? 1
            : screen === "checkout"
              ? 2
              : screen === "success" || screen === "failed"
                ? 3
                : 1
        }
        onLogoClick={handleBackToHome}
      />

      {screen === "pricing" && <PricingPage onSelectPlan={handleSelectPlan} />}

      {screen === "checkout" && selectedPlan && (
        <CheckoutPage
          initialPlan={selectedPlan}
          initialBilling={selectedBilling}
          onBack={handleBackToHome}
          onSuccess={handleSuccess}
          onFailed={handleFailed}
        />
      )}

      {screen === "success" && selectedPlan && (
        <SuccessPage
          plan={selectedPlan}
          billing={selectedBilling}
          user={userData}
          txnId={txnId}
          onDashboard={() => {
            alert("Redirecting to dashboard...");
          }}
        />
      )}

      {screen === "failed" && selectedPlan && (
        <FailedPage
          plan={selectedPlan}
          billing={selectedBilling}
          errorMsg={errorMsg}
          onRetry={handleRetry}
          onChangePlan={handleBackToHome}
        />
      )}
    </div>
  );
}

export default SubscriptionLayout;
