import { createSlice } from "@reduxjs/toolkit";

const folderSlice = createSlice({
  name: "folder",
  initialState: {
    items: [],
  },
  reducers: {
    setFolders: (state, action) => {
      state.items = action.payload.map((item) => ({
        ...item,
        selected: false,
      }));
    },
    toggleItems: (state, action) => {
      const itmes = state.items.find((i) => i._id === action.payload);
      if (itmes) {
        itmes.selected = !itmes.selected;
      }
    },
    selectAll: (state) => {
      state.items.forEach((item) => {
        item.selected = !item.selected;
      });
    },
    deleteSelectedItems: (state) => {
      state.items = state.items.filter((item) => !item.selected);
    },
  },
});

export const { setFolders, selectAll, toggleItems, deleteSelectedItems } =
  folderSlice.actions;
export default folderSlice.reducer;
