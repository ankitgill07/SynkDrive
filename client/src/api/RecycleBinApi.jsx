import { axiosInstance } from "./AxiosInstance";

export const getAllRecycleBinData = async () => {
  try {
    const response = await axiosInstance.get("/recycle-bin");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const restoreDataApi = async (id) => {
  try {
    const response = await axiosInstance.patch(`/recycle-bin/restore/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const restoreFoldersApi = async (id) => {
  try {
    const response = await axiosInstance.patch(
      `/recycle-bin/restore/folder/${id}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteFileApi = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/recycle-bin/delete/file/${id}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteFolderApi = async (folderId) => {
  try {
    const response = await axiosInstance.delete(
      `/recycle-bin/delete/folder/${folderId}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getRecycleDataByIdApi = async (folderId) => {
  try {
    const response = await axiosInstance.get(`/recycle-bin/${folderId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const bulkSoftDeleteFileApi = async (ids) => {
  try {
    const response = await axiosInstance.patch(`/recycle-bin/bulk/delete`, ids);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const bulkDeleteParmanetlyApi = async (selectedIds) => {
  try {
    const response = await axiosInstance.delete(
      "/recycle-bin/bulk/delete/parmanetly",
      {
        data: {
          allId: selectedIds,
        },
      },
    );
    return response?.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const bulkRestoreDataApi = async (ids) => {
  try {
    const response = await axiosInstance.patch(
      "/recycle-bin/bulk/restore",
      ids,
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
