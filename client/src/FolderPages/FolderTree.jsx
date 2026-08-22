import React, { useMemo, useState, memo } from "react";
import { FaFolder } from "react-icons/fa";

import ChildFoldersViews from "./FolderCard";
import FileUploadProgress from "@/models/FileUploadProgress";
import RawLayout from "./GridView/RawLayout";
import SwitchLayout from "./GridView/SwitchLayout";
import SortListLayout from "./GridView/SortListLayout";
import { useSelector, useDispatch } from "react-redux";
import { selectAll, deselectAll } from "@/lib/FolderSlice";
import { SelectionCheckbox } from "@/utils/Helpers";

import EmptyFolderPage from "@/Pages/EmptyFolderPage";
import { useFileProgress } from "@/contextApi/FileProgress";
import DragAndDropFiles from "@/Pages/DragAndDropFiles";
import useDragAndDrop from "@/hooks/useDragAndDrop";

function RootFoldersViews({ handleOpen, Allfolder }) {
  const [view, setView] = useState(localStorage.getItem("view") || "grid");
  const [starredSort, setStarredSort] = useState(false);
  const [recentSort, setRecentSort] = useState(false);
  const [sortedByType, setSortedByType] = useState(" ");

  const {
    handleDragLeave,
    handleDragOver,
    handleDragEnter,
    handleDrop,
    isDraggingOver,
  } = useDragAndDrop();

  const items = useSelector((state) => state.folder.items);

  const filteredItems = useMemo(() => {
    let output = [...items];

    if (recentSort) {
      output = [...output].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }
    if (sortedByType === "name") {
      output = [...output].sort((a, z) => z.name.localeCompare(a.name));
    }
    if (sortedByType === "updatedAt") {
      output = [...output].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      );
    }
    if (sortedByType === "size") {
      output = [...output].sort((a, b) => b.size - a.size);
    }

    if (starredSort) {
      output = output.filter((item) => item.isStarred);
    }

    return output;
  }, [items, recentSort, starredSort, sortedByType]);

  const handleSortStarredItems = () => {
    setStarredSort((prev) => !prev);
    setRecentSort(false);
    setSortedByType("");
  };

  const handleSortRecentItems = () => {
    setRecentSort((prev) => !prev);
    setStarredSort(false);
    setSortedByType("");
  };

  const dispatch = useDispatch();
  const totalCount = filteredItems.length;
  const selectedCount = filteredItems.filter((item) => item.selected).length;

  const foldersList = useMemo(() => filteredItems.filter((item) => item.type === "folder"), [filteredItems]);
  const filesList = useMemo(() => filteredItems.filter((item) => item.type !== "folder"), [filteredItems]);

  let checkboxState = false;
  if (selectedCount > 0) {
    if (selectedCount === totalCount) {
      checkboxState = true;
    } else {
      checkboxState = "indeterminate";
    }
  }

  return (
    <div
      className="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DragAndDropFiles isDraggingOver={isDraggingOver} />
      <div className="w-full  h-full mt-12 lg:mt-16  py-8 relative">
        <SwitchLayout
          handleSortRecentItems={handleSortRecentItems}
          starredSort={starredSort}
          recentSort={recentSort}
          handleSortStarredItems={handleSortStarredItems}
          view={view}
          setView={setView}
          allData={Allfolder}
        />

        <div className="mt-9">
          {filteredItems.length > 0 ? (
            <>
              {view === "grid" ? (
                <div className="w-full font-inter">
                  <div className="w-full flex flex-col gap-8">
                    {/* Folders Section */}
                    {foldersList.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                          Folders
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                          {foldersList.map((folder) => (
                            <ChildFoldersViews
                              key={folder._id}
                              folder={folder}
                              allItems={Allfolder}
                              mode="normal"
                              handleOpen={handleOpen}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Files Section */}
                    {filesList.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                          Files
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 overflow-hidden">
                          {filesList.map((file) => (
                            <ChildFoldersViews
                              key={file._id}
                              folder={file}
                              allItems={Allfolder}
                              mode="normal"
                              handleOpen={handleOpen}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {foldersList.length === 0 && filesList.length === 0 && (
                      <div className="h-64 flex flex-col justify-center items-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                        <p className="text-sm font-medium">No files or folders in this directory</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full font-inter">
                  <SortListLayout
                    sortedByType={sortedByType}
                    setSortedByType={setSortedByType}
                  />
                  {filteredItems.map((folder) => (
                    <RawLayout
                      key={folder._id}
                      folder={folder}
                      allItems={Allfolder}
                      handleOpen={handleOpen}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyFolderPage Allfolder={Allfolder} />
          )}
        </div>
      </div>

      <FileUploadProgress Allfolder={Allfolder} />
    </div>
  );
}

export default memo(RootFoldersViews);
