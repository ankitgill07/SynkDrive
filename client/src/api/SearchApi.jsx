import { axiosInstance } from "./AxiosInstance";

export const searchQueryApi = async (query) => {
  console.log(query);

  try {
    const response = await axiosInstance.get(`/search/${query}`);
    return response?.data;
  } catch (error) {
    return error.response.data;
  }
};
