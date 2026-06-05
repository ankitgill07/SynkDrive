import { axiosInstance } from "./AxiosInstance";

export const createSubscriptionApi = async (planId) => {
  try {
    const response = await axiosInstance.post("/subscription/create", {
      planId,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getSubscriptionStatusApi = async () => {
  try {
    const response = await axiosInstance.get("/subscription/status");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const subscriptionPausedApi = async () => {
  try {
    const response = await axiosInstance.patch("/subscription/paused");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const subscriptionResumedApi = async() => {
  try {
    const response = await axiosInstance.patch('/subscription/resumed')
    return response.data
  } catch (error) {
    return error.response.data
  }
}