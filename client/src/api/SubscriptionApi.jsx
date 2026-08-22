import { axiosInstance } from "./AxiosInstance";

export const createSubscriptionApi = async (planId) => {
  try {
    const response = await axiosInstance.post("/subscription/create", {
      planId,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Subscription creation failed" };
  }
};

export const verifySubscriptionApi = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/subscription/verify", paymentData);
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Subscription verification failed" };
  }
};

export const activateFreePlanApi = async () => {
  try {
    const response = await axiosInstance.post("/subscription/activate-free");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Free plan activation failed" };
  }
};

export const getSubscriptionStatusApi = async () => {
  try {
    const response = await axiosInstance.get("/subscription/status");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to fetch status" };
  }
};

export const subscriptionPausedApi = async () => {
  try {
    const response = await axiosInstance.patch("/subscription/paused");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to pause subscription" };
  }
};

export const subscriptionResumedApi = async () => {
  try {
    const response = await axiosInstance.patch("/subscription/resumed");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to resume subscription" };
  }
};

export const subscriptionCancelApi = async () => {
  try {
    const response = await axiosInstance.patch("/subscription/cancel");
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to cancel subscription" };
  }
};