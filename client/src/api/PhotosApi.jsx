import { axiosInstance } from "./AxiosInstance";

export const getAllPhotosApi = async () => {
  try {
    const response = await axiosInstance.get("/photos");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
