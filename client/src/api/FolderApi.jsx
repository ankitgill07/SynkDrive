import { axiosInstance } from "./AxiosInstance"

export const createFolderApi = async (id, folderName) => {

    try {
        const response = await axiosInstance.post(`/folder/${id || ""}`, folderName)
        return response.data
    } catch (error) {
        return error.response.data
    }
}

export const getAllFoldersApi = async (id) => {
    try {
        const response = await axiosInstance.get(`/folder/${id || ""}`)
        return response.data
    } catch (error) {
        return error.response.data
    }
}


export const renameFolderNameApi = async (id , name) => {
    try {
        const response = await axiosInstance.patch(`/folder/${id}` , name)
        return response.data
    } catch (error) {
        return error?.response?.data
    }
}

export const softDeleteFolderApi = async (id) => {
    try {
      const response = await axiosInstance.put(`/folder/${id}`)
      return response.data  
    } catch (error) {
    return error.response.data
    }
}

