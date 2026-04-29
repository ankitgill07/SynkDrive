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
