import { createSlice } from "@reduxjs/toolkit";

const recycleSlice = createSlice({
  name: "recycleBin",
  initialState: {
    recycleItems: [],
    childFolderItems: [],
  },
  reducers: {
    setRecycleData: (state, action) => {
      state.recycleItems = action.payload.map((data) => ({
        ...data,
        selected: false,
      }));
    },
    setChildFolderData: (state, action) => {
      state.childFolderItems = action.payload.map((data) => ({
        ...data,
        selected: false,
      }));
    },
    toggleData: (state, action) => {
      const trashData = state.recycleItems.find(
        ({ _id }) => _id === action.payload,
      );
      if (trashData) {
        trashData.selected = !trashData.selected;
      }
    },
    selectAllTrashData: (state) => {
      state.recycleItems.forEach((data) => {
        data.selected = !data.selected;
      });
    },
    deleteSelectedtrashData: (state) => {
      state.recycleItems = state.recycleItems.filter((data) => !data.selected);
    },
  },
});

export const {
  setRecycleData,
  setChildFolderData,
  toggleData,
  selectAllTrashData,
  deleteSelectedtrashData,
} = recycleSlice.actions;
export default recycleSlice.reducer;
