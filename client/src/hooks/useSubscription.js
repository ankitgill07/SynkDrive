import {
  getSubscriptionStatusApi,
  subscriptionPausedApi,
  subscriptionResumedApi,
  subscriptionCancelApi,
} from "@/api/SubscriptionApi";
import { userAuth } from "@/contextApi/AuthContext";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function useSubscription() {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const { checkAuthorization } = userAuth?.() || {};

  const handleSubscriptionData = async () => {
    setLoading(true);
    try {
      const result = await getSubscriptionStatusApi();
      if (result.success && result.data?.subscription) {
        setSubscriptionData(result.data.subscription);
      }
    } catch (err) {
      console.error("Error fetching subscription status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePausedSubscription = async () => {
    const result = await subscriptionPausedApi();
    if (result.success) {
      await handleSubscriptionData();
      checkAuthorization?.();
      setModal(null);
      return toast.success(result.data || "Subscription successfully paused");
    } else {
      toast.error(result.message || "Failed to pause subscription");
    }
  };

  const handleResumedSubscription = async () => {
    const result = await subscriptionResumedApi();
    if (result.success) {
      await handleSubscriptionData();
      checkAuthorization?.();
      setModal(null);
      return toast.success(result.data || "Subscription successfully resumed");
    } else {
      return toast.error(result.message || "Failed to resume subscription");
    }
  };

  const handleCancelSubscription = async () => {
    const result = await subscriptionCancelApi();
    if (result.success) {
      await handleSubscriptionData();
      checkAuthorization?.();
      setModal(null);
      return toast.success(result.data || "Subscription successfully cancelled");
    } else {
      return toast.error(result.message || "Failed to cancel subscription");
    }
  };

  useEffect(() => {
    handleSubscriptionData();
  }, []);

  return {
    modal,
    setModal,
    subscriptionData,
    setSubscriptionData,
    loading,
    refreshSubscription: handleSubscriptionData,
    handlePausedSubscription,
    handleResumedSubscription,
    handleCancelSubscription,
  };
}

export default useSubscription;

