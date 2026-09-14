import { axiosInstance } from "./AxiosInstance";

export const updatedProfileApi = async (formData) => {
  try {
    const response = await axiosInstance.patch("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const userLogoutApi = async () => {
  try {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const disableAccountApi = async () => {
  try {
    const response = await axiosInstance.post("/user/disable");
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const setPasswordApi = async (password) => {
  try {
    const response = await axiosInstance.patch("/user/setPassword", {
      password: password,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const updatePasswordApi = async (data) => {
  try {
    const response = await axiosInstance.patch("/user/password/update", {
      currentPassword: data.currentPassword,
      newPassword: data.password,
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const getUserProfileApi = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const logoutForAllDeviceApi = async () => {
  try {
    const response = await axiosInstance.delete("/user/all-device-logout");
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const logoutDevicesBySidApi = async (sid) => {
  try {
    const response = await axiosInstance.delete(`/user/session/${sid}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};

export const deleteAccountPermanentlyApi = async () => {
  try {
    const response = await axiosInstance.delete("/user/account-deleted");
    return response.data;
  } catch (error) {
    return error.response?.data || { error: error.message };
  }
};
