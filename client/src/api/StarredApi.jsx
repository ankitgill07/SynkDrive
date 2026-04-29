import { axiosInstance } from "./AxiosInstance";

export const getStarredDataApi = async () => {
  try {
    const response = await axiosInstance.get("/starred");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const addFileToStarred = async (id, isStarred) => {
  try {
    const response = await axiosInstance.patch(`/starred/file/${id}`, {
      value: isStarred,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const addFolderTreeStarredApi = async (id, isStarred) => {
  try {
    const response = await axiosInstance.patch(`/starred/folder/${id}`, {
      value: isStarred,
    });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


