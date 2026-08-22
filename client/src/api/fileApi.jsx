import axios from "axios";
import { axiosInstance } from "./AxiosInstance";
import JSZip from "jszip";
import { getMimeType } from "@/utils/Helpers";

export const uploadInitiateApi = async (id, fileObj) => {
  try {
    const contentType = fileObj.type || getMimeType(fileObj.name);
    const response = await axiosInstance.post(
      `/file/upload/initiate/${id || ""}`,
      {
        contentType: contentType,
        fileName: fileObj.name,
        size: fileObj.size,
      },
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const uploadFileS3Buket = async (
  uploadUrl,
  fileId,
  file,
  contentType,
  updateProgress,
) => {
  try {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": contentType || file.type || "application/octet-stream",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        updateProgress(fileId, percentCompleted);
      },
    });

    return response.status;
  } catch (error) {
    return error.response?.status || 500;
  }
};

export const uploadCompletedApi = async (fileId) => {
  try {
    const response = await axiosInstance.post(
      `/file/upload/completed/${fileId}`,
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { message: "Failed to mark upload completed" };
  }
};

export const renameFileNameApi = async (id, name) => {
  try {
    const response = await axiosInstance.patch(`/file/${id}`, name);
    return response.data;
  } catch (error) {
    return error?.response?.data;
  }
};

export const recycledFilebyId = async (fileId) => {
  try {
    const response = await axiosInstance.patch(`/file/${fileId}/delete`);
    return response?.data;
  } catch (error) {
    return error.response?.data || { message: "Failed to delete file" };
  }
};

export const bulkDownloadFileApi = async (fileId) => {
  try {
    const { data } = await axiosInstance.post("/file/bulk/download", fileId);
    const zip = new JSZip();

    await Promise.all(
      data.map(async ({ url, fileName }) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        zip.file(fileName, arrayBuffer);
      }),
    );

    const zipBlob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const blobUrl = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "SynDrive.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    return error.response?.data || { message: "Failed to bulk download files" };
  }
};

export const importFormGoogeDiveApi = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/file/drive-import`,
      { files: payload },
    );
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getDownloadUrlApi = async (fileId) => {
  try {
    const response = await axiosInstance.get(`/file/${fileId}?action=download&json=true`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};

export const getPreviewUrlApi = async (fileId) => {
  try {
    const response = await axiosInstance.get(`/file/${fileId}?json=true`);
    return response.data;
  } catch (error) {
    return error.response?.data;
  }
};
