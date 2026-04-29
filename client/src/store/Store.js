import { configureStore } from "@reduxjs/toolkit";
import folderReducer from "../lib/FolderSlice";
import dashboardReducer from "../lib/dashboardSlice";
import recycleSliceReducer from "../lib/RecycleSlice";

export const store = configureStore({
  reducer: {
    folder: folderReducer,
    dashboard: dashboardReducer,
    recycleBin: recycleSliceReducer,
  },
});
