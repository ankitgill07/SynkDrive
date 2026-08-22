import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  activeView: 'dashboard',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
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
  },
});

export const { setSidebarCollapsed, toggleSidebar, setActiveView } = dashboardSlice.actions;
export default dashboardSlice.reducer;
