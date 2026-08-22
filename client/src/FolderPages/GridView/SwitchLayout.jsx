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
import { deleteSelectedItems, selectAll, deselectAll } from "@/lib/FolderSlice";
import { bulkDownloadFileApi } from "@/api/fileApi";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const items = useSelector((state) => state.folder.items);
  const selectId = items
    .filter((item) => item.selected)
    .map((item) => item._id);

  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      const { success, data } = await bulkSoftDeleteFileApi(selectId);
      if (success) {
        allData();
        dispatch(deleteSelectedItems());
        toast.success(data);
      }
    } catch (err) {
      toast.error("Failed to delete selected items");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleBulkDownload = async () => {
    const result = await bulkDownloadFileApi(selectId);
  };

  return (
    <div className="fixed left-0 lg:left-64 w-full lg:w-[calc(100%-256px)] z-10 px-4 py-3 bg-white top-[120px] lg:top-[136px] overflow-x-auto scrollbar-none">
      <div className="mb-2 flex flex-wrap justify-between items-center gap-y-3">
        <div className="flex items-center gap-x-3 h-10">
          <AnimatePresence mode="wait">
            {selectId.length > 0 ? (
              <div className="flex items-center gap-x-3" >
                <p className="font-medium font-inter text-sm text-gray-500 whitespace-nowrap">
                  {selectId.length} selected:
                </p>

                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="flex items-center gap-1 cursor-pointer font-inter bg-[#d9d4cc3b] text-gray-800 hover:bg-red-50 hover:text-red-600 rounded-full px-4 py-1 font-medium text-xs transition-colors shrink-0"
                >
                  <Trash size={15} />
                  Delete
                </button>

                <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">
                        Delete Selected Items?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        Are you sure you want to move the {selectId.length} selected items to the Recycle Bin?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting} className="bg-secondary text-foreground border-border hover:bg-secondary/80">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.preventDefault();
                          handleBulkDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <button
                  onClick={handleBulkDownload}
                  className="flex items-center gap-1 cursor-pointer font-inter bg-[#d9d4cc3b] text-gray-800 hover:bg-[#e9e8e8] rounded-full px-4 py-1 font-medium text-xs transition-colors shrink-0"
                >
                  <ArrowDownToLine size={15} />
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
