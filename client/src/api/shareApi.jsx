import { axiosInstance } from "./AxiosInstance";

export const shareWithPublicLinkApi = async (fileId, permission) => {
  try {
    const response = await axiosInstance.post(`/share/files/${fileId}/link`, {
      linkEnabled: false,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const shareFileToggleApi = async (fileId, linkEnabled) => {
  try {
    const response = await axiosInstance.patch(
      `/share/file/${fileId}/link/toggle`,
      { linkEnabled },
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getShareWithLinkApi = async (fileId, token) => {
  try {
    const tokenQuery = token ? `?token=${encodeURIComponent(token)}` : "";
    const response = await axiosInstance.get(
      `/share/public/file/${fileId}${tokenQuery}`,
    );
    return response.data;
  } catch (error) {
    return (
      error?.response?.data || {
        success: false,
        message: "Unable to open this shared file.",
      }
    );
  }
};

export const getShareFileInfo = async (shareId) => {
  try {
    const response = await axiosInstance.get(`/share/file/${shareId}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const shareWithLinkPermissionsChangeApi = async (fileId, permission) => {
  try {
    const response = await axiosInstance.patch(
      `/share/file/${fileId}/link/permissions`,
      {
        linkPermission: permission,
      },
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const shareFileWithEmailInviteApi = async (fileId, emails, data) => {
  try {
    const response = await axiosInstance.post(
      `/share/file/${fileId}/email/invite`,
      {
        emails,
        permission: data.role,
        message: data.message,
      },
    );
    return response?.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const getShareEmaileFileDataApi = async (fileId, token) => {
  try {
    const tokenQuery = token ? `?token=${token}` : "";
    const response = await axiosInstance.get(
      `/share/files/${fileId}/email-share${tokenQuery}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getListPeopleAccessFileApi = async (fileId) => {
  try {
    const response = await axiosInstance.get(`/share/files/${fileId}/people`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


export const getSharedFileDashboardApi = async () => {
  try {
    const response = await axiosInstance.get("/share/files/dashboard")
    return response.data
  } catch (error) {
    return error?.response?.data
  }
}

export const getUsertoShareFileEmailApi = async (email , signal) => {
  try {
    const response = await axiosInstance.get(`/share/files/${email}/user`,  {
    signal, 
  })
    return response?.data
  } catch (error) {
 if (err.name === "CanceledError") throw { name: "AbortError" }; // axios abort
    if (err.response?.status === 404) return { data: [] }; // ✅ not found = empty
    throw err;
  }
}
