import { axiosInstance } from "./AxiosInstance";

export const shareWithPublicLinkApi = async (fileId, permission) => {
  try {
    const response = await axiosInstance.post(`/share/files/${fileId}/link`, {
      linkEnabled: false,
      linkPermission: permission,
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
    const response = await axiosInstance.get(
      `/share/public/file/${fileId}?token=${token}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
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

export const shareFileWithEmailInviteApi = async (fileId, data) => {
  try {
    const response = await axiosInstance.post(
      `/share/file/${fileId}/email/invite`,
      {
        email: data.email,
        permission: data.role,
      },
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getShareEmaileFileDataApi = async (fileId, token) => {
  try {
    const response = await axiosInstance.get(
      `/share/files/${fileId}/email-share?token=${token}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};


