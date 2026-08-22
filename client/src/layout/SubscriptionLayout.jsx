import CheckoutPage from "@/Pages/subscriptions/CheckoutPage";
import FailedPage from "@/Pages/subscriptions/FailedPage";
import Navbar from "@/Pages/subscriptions/Navbar";
import PricingPage from "@/Pages/subscriptions/PricingPage";
import SuccessPage from "@/Pages/subscriptions/SuccessPage";
import { userAuth } from "@/contextApi/AuthContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const STEPS = ["Select Plan", "Checkout", "Confirm"];

function SubscriptionLayout() {
  const [screen, setScreen] = useState("pricing");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState("monthly");
  const [userData, setUserData] = useState(null);
  const [txnId, setTxnId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { checkAuthorization } = userAuth() || {};

  function handleSelectPlan(plan, billing) {
    setSelectedPlan(plan);
    setSelectedBilling(billing);
    setScreen("checkout");
  }

  function handleSuccess(result) {
    setSelectedPlan(result.plan);
    setSelectedBilling(result.billing);
    setUserData(result.user);
    setTxnId(result.txnId);
    setErrorMsg("");
    setScreen("success");
    checkAuthorization?.();
  }

  function handleFailed(result) {
    setSelectedPlan(result.plan);
    setSelectedBilling(result.billing);
    setUserData(result.user);
    setErrorMsg(result.errorMsg);
    setScreen("failed");
  }

  function handleRetry() {
    setErrorMsg("");
    setScreen("checkout");
  }

  function handleBackToHome() {
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
        onLogoClick={() => navigate("/drive/home")}
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
            navigate("/drive/home");
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

