import { axiosInstance } from "./axiosInstance";

export const usersRegister = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const usersLogin = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const sendVerificationCode = async (email) => {
  try {
    const response = await axiosInstance.post(
      "/auth/send-otp",
      JSON.stringify({ email }),
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const receiveUserData = async () => {
  try {
    const response = await axiosInstance.get("/auth");
    return { success: true, ...response.data };
  } catch (error) {
    return error?.response?.data;
  }
};

export const googleLogin = async (code) => {
  try {
    const response = await axiosInstance.post(
      "/auth/google",
      JSON.stringify({ code }),
    );
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const githubLogin = async (code) => {
  try {
    const response = await axiosInstance.post(
      "/auth/github",
      JSON.stringify({ code }),
    );
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};
