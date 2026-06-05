import { toast } from "sonner";

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

  const eventSource = new EventSource(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/events?userId=${userId}`,
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "subscriptionActivated") {
      if (waitingToastId) toast.dismiss(waitingToastId);
      eventSource.close();

      onSuccess?.({
        plan,
        billing,
        user: { id: userId },
        txnId: data.txnId ?? subscriptionId,
      });
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error:", err);
    if (waitingToastId) toast.dismiss(waitingToastId);
    eventSource.close();

  
    onFailed?.({
      plan,
      billing,
      user: { id: userId },
      errorMsg: "Connection lost while confirming payment.",
    });
  };

  const rzp = new Razorpay({
    key:
      razorpayMode === "live"
        ? "rzp_live_RStZdfYFCYNQL7"
        : "rzp_test_SSC4KlMc0gpJjI",
    name: "Storage App",
    description: "Subscribe to premium storage plan",
    image: "https://dzdw2zccyu2wu.cloudfront.net/overview/readme-typing.svg",
    subscription_id: subscriptionId,

    handler: async function (response) {
   
      waitingToastId = toast.loading("Processing payment...", {
        description: "Please wait while we confirm your payment",
      });
    },

    modal: {
      ondismiss: function () {
        if (waitingToastId) toast.dismiss(waitingToastId);
        eventSource.close();
        toast.info("Payment window closed", {
          description: "You cancelled the payment process.",
          duration: 4000,
        });
    
      },
    },
  });

  rzp.on("payment.failed", function (response) {
    if (waitingToastId) toast.dismiss(waitingToastId);
    eventSource.close();

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
