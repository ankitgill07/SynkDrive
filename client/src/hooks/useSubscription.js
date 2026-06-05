import {
  getSubscriptionStatusApi,
  subscriptionPausedApi,
  subscriptionResumedApi,
} from "@/api/SubscriptionApi";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function useSubscription() {
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [modal, setModal] = useState(null);

  const handleSubscriptionDate = async () => {
    const result = await getSubscriptionStatusApi();
    if (result.success) {
      const { subscription } = result.data;
      setSubscriptionData(subscription);
      console.log(subscription);
    }
  };

  const handlePausedSubscription = async () => {
    const result = await subscriptionPausedApi();
    if (result.success) {
      handleSubscriptionDate();
      setModal(null)
      return toast.success(result.data);
    } else {
      toast.error(result.message);
    }
  };

  const handleResumedSubscription = async () => {
    const result = await subscriptionResumedApi();
    if (result.success) {
      handleSubscriptionDate();
      setModal(null)
      return toast.success(result.data);
    } else {
      return toast.error(result.message);
    }
  };

  useEffect(() => {
    handleSubscriptionDate();
  }, []);

  return {
    modal ,
    setModal,
    subscriptionData,
    setSubscriptionData,
    handlePausedSubscription,
    handleResumedSubscription,
  };
}

export default useSubscription;
