import { toast } from "sonner";
import { verifySubscriptionApi } from "@/api/SubscriptionApi";

export function loadRazorpaySDK() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpayPopup({
  subscriptionId,
  userId,
  razorpayMode,
  plan,
  billing,
  onSuccess,
  onFailed,
}) {
  let waitingToastId = null;
  let isHandled = false;

  let eventSource = null;
  try {
    eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_BASE_URL}/events?userId=${userId}`,
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "subscriptionActivated" && !isHandled) {
          isHandled = true;
          if (waitingToastId) toast.dismiss(waitingToastId);
          eventSource.close();

          onSuccess?.({
            plan,
            billing,
            user: { id: userId },
            txnId: data.txnId ?? subscriptionId,
          });
        }
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE notice:", err);
      if (eventSource) eventSource.close();
    };
  } catch (err) {
    console.warn("SSE connection skipped:", err);
  }

  const razorpayKey =
    import.meta.env.VITE_APP_RAZORPAY_API_KEY ||
    (razorpayMode === "live"
      ? "rzp_live_RStZdfYFCYNQL7"
      : "rzp_test_SSC4KlMc0gpJjI");

  const rzp = new window.Razorpay({
    key: razorpayKey,
    name: "SynkDrive",
    description: `Subscribe to ${plan?.name || "Premium"} Storage Plan`,
    subscription_id: subscriptionId,
    theme: {
      color: "#155dfc",
    },

    handler: async function (response) {
      waitingToastId = toast.loading("Confirming subscription...", {
        description: "Please wait while we verify your payment",
      });

      try {
        const verifyRes = await verifySubscriptionApi({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_subscription_id: response.razorpay_subscription_id || subscriptionId,
          razorpay_signature: response.razorpay_signature,
        });

        if (waitingToastId) toast.dismiss(waitingToastId);
        if (eventSource) eventSource.close();

        if (verifyRes.success) {
          isHandled = true;
          toast.success("Payment verified successfully!");
          onSuccess?.({
            plan,
            billing,
            user: { id: userId },
            txnId: response.razorpay_payment_id || subscriptionId,
          });
        } else {
          toast.error(verifyRes.message || "Payment verification failed");
          onFailed?.({
            plan,
            billing,
            user: { id: userId },
            errorMsg: verifyRes.message || "Payment verification failed",
          });
        }
      } catch (err) {
        if (waitingToastId) toast.dismiss(waitingToastId);
        if (eventSource) eventSource.close();
        console.error("Payment verification error:", err);
        // If verify endpoint encountered network error, fallback to SSE if still running
        if (!isHandled) {
          onSuccess?.({
            plan,
            billing,
            user: { id: userId },
            txnId: response.razorpay_payment_id || subscriptionId,
          });
        }
      }
    },

    modal: {
      ondismiss: function () {
        if (waitingToastId) toast.dismiss(waitingToastId);
        if (eventSource) eventSource.close();
        if (!isHandled) {
          toast.info("Payment window closed", {
            description: "You cancelled the payment process.",
            duration: 4000,
          });
        }
      },
    },
  });

  rzp.on("payment.failed", function (response) {
    if (waitingToastId) toast.dismiss(waitingToastId);
    if (eventSource) eventSource.close();

    onFailed?.({
      plan,
      billing,
      user: { id: userId },
      errorMsg:
        response.error?.description ?? "Payment failed. Please try again.",
    });
  });

  rzp.open();
}

