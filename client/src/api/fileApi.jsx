import axios from "axios";
import { axiosInstance } from "./AxiosInstance";
import JSZip from "jszip";
export const uploadInitiateApi = async (id, fileObj) => {
  try {
    const response = await axiosInstance.post(
      `/file/upload/initiate/${id || ""}`,
      {
        contentType: fileObj.type,
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
  updateProgress,
) => {
  try {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
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
    return error.response.status;
  }
};

export const uploadCompletedApi = async (fileId) => {
  try {
    const response = await axiosInstance.post(
      `/file/upload/completed/${fileId}`,
    );
    return response.data;
  } catch (error) {
    return error.response.data;
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
    return error.response.data;
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
    return error.response.data;
  }
};

export const importFormGoogeDiveApi = async (
  payload,
  setProgress = () => {},
) => {
  try {
    const response = await axiosInstance.post(
      `/file/drive-import`,
      { files: payload },
      {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          console.log(percentCompleted);
        },
      },
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
