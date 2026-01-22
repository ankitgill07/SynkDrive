import { axiosInstance } from "./AxiosInstance"

export const uploadFilesApi = async (id, fileObj) => {
    console.log(id);

    try {
        const response = await axiosInstance.post(`/file/${id || ""}`,
            fileObj.file,
            {
                headers: {
                    "X-File-Name": fileObj.name,
                    "Content-Type": fileObj.type,
                    "Size": fileObj.size
                },
                transformRequest: (data) => data, // 🔴 REQUIRED
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        return error.response?.data;
    }
};


