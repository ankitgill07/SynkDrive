import { axiosInstance } from './AxiosInstance';

export const getDashboardMetrics = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard-stats');
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to fetch metrics' };
  }
};

export const getAdminUsers = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to fetch users' };
  }
};

export const updateAdminUser = async (userId, updates) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${userId}`, updates);
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to update user' };
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to delete user' };
  }
};

export const bulkDeleteUsers = async (userIds) => {
  try {
    const response = await axiosInstance.post('/admin/users/bulk-delete', { userIds });
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to bulk delete users' };
  }
};

export const logoutAdminUser = async (userId) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/logout`);
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to logout user' };
  }
};

export const bulkLogoutUsers = async (userIds) => {
  try {
    const response = await axiosInstance.post('/admin/users/bulk-logout', { userIds });
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to bulk logout users' };
  }
};

export const getStorageStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/storage-stats');
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to fetch storage stats' };
  }
};

export const getSystemLogs = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/admin/logs', { params });
    return response.data;
  } catch (error) {
    return error?.response?.data || { error: 'Failed to fetch logs' };
  }
};
