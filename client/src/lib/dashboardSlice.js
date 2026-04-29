import { createSlice } from "@reduxjs/toolkit";
import { mockUsers, mockNotifications } from "./mock-data";

const initialState = {
  users: mockUsers,
  notifications: mockNotifications,
  sidebarCollapsed: false,
  activeView: "dashboard",
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    updateUser: (state, action) => {
      const { userId, updates } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        Object.assign(user, updates);
      }
    },
    deleteUser: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.status = "deleted";
        user.storageUsed = 0;
      }
    },
    forceLogoutUser: (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.status = "offline";
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload,
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
  },
});

export const {
  setSidebarCollapsed,
  toggleSidebar,
  setActiveView,
  updateUser,
  deleteUser,
  forceLogoutUser,
  markNotificationRead,
  markAllNotificationsRead,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
