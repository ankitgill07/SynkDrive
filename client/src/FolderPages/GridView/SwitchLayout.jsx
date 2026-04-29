import {
  ArrowDownToLine,
  Clock8,
  LayoutGrid,
  Rows3,
  Star,
  Trash,
} from "lucide-react";
import { HiMiniSlash } from "react-icons/hi2";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAction from "@/hooks/useAction";
import { useDispatch, useSelector } from "react-redux";
import { bulkSoftDeleteFileApi } from "@/api/RecycleBinApi";
import { deleteSelectedItems } from "@/lib/FolderSlice";
import { bulkDownloadFileApi } from "@/api/fileApi";
import { AnimatePresence } from "framer-motion";

function SwitchLayout({
  view,
  setView,
  handleSortStarredItems,
  handleSortRecentItems,
  recentSort,
  allData,
  starredSort,
}) {
  const currentView = (view) => {
    localStorage.setItem("view", view);
    const currentView = localStorage.getItem("view");
    setView(currentView);
  };

  const dispatch = useDispatch();

  const items = useSelector((state) => state.folder.items);
  const selectId = items
    .filter((item) => item.selected)
    .map((item) => item._id);

  const handleBulkDelete = async () => {
    const { success, data } = await bulkSoftDeleteFileApi(selectId);
    if (success) {
      allData();
      dispatch(deleteSelectedItems());
      toast.success(data);
    }
  };

  const handleBulkDownload = async () => {
    const result = await bulkDownloadFileApi(selectId);
  };

  return (
    <div className=" fixed  left-65 w-[calc(100%-260px)] z-10 px-5 py-3 bg-white top-34">
      <div className="mb-6  flex justify-between items-center">
        <div className="flex items-center gap-x-3 h-10">
          <AnimatePresence mode="wait">
            {selectId.length > 0 ? (
              <div className="flex items-center gap-x-3" >
                <p className="font-medium font-inter text-sm text-gray-500 whitespace-nowrap">
                  {selectId.length} selected:
                </p>

                <button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 cursor-pointer font-inter bg-[#d9d4cc3b] text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-full px-5 py-1.5 font-medium text-sm transition-colors"
                >
                  <Trash size={18} />
                  Delete
                </button>

                <button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBulkDownload}
                  className="flex items-center gap-1 cursor-pointer font-inter bg-[#d9d4cc3b] text-gray-800 hover:bg-[#e9e8e8] rounded-full px-5 py-1.5 font-medium text-sm transition-colors"
                >
                  <ArrowDownToLine size={18} />
                  Download
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-x-3">
                <button
                  onClick={handleSortRecentItems}
                  className={`flex items-center gap-1 cursor-pointer font-inter rounded-full px-5 py-1.5 transition-colors ${
                    recentSort
                      ? "text-white bg-black shadow-lg shadow-black/10"
                      : "bg-[#d9d4cc3b] text-gray-800 hover:bg-[#e9e8e8]"
                  }`}
                >
                  <Clock8 size={18} />
                  Recents
                </button>

                <button
                  onClick={handleSortStarredItems}
                  className={`flex items-center gap-1 cursor-pointer font-inter rounded-full px-5 py-1.5 transition-colors ${
                    starredSort
                      ? "text-white bg-black shadow-lg shadow-black/10"
                      : "bg-[#d9d4cc3b] text-gray-800 hover:bg-[#e9e8e8]"
                  }`}
                >
                  <Star size={18} />
                  Starred
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div
          title="List Layout"
          className="relative  flex w-28 h-10 bg-gray-100 rounded-full p-1 shadow-inner"
        >
          <span
            className={`absolute top-1 left-1 h-8 w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
              view === "grid" ? "translate-x-full" : ""
            }`}
          />

          <button
            onClick={() => currentView("list")}
            className={`relative z-10 flex items-center cursor-pointer justify-center w-1/2 rounded-full transition-all duration-200 ${
              view === "list" ? "text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            <Rows3 size={18} />
          </button>

          <button
            onClick={() => currentView("grid")}
            className={`relative z-10 flex items-center justify-center w-1/2 cursor-pointer rounded-full transition-all duration-200 ${
              view === "grid" ? "text-black" : "text-gray-500 hover:text-black"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SwitchLayout;
