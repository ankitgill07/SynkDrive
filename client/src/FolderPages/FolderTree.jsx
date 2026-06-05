import React, { useMemo, useState, memo } from "react";

import ChildFoldersViews from "./FolderCard";
import FileUploadProgress from "@/models/FileUploadProgress";
import RawLayout from "./GridView/RawLayout";
import SwitchLayout from "./GridView/SwitchLayout";
import SortListLayout from "./GridView/SortListLayout";
import { useSelector } from "react-redux";

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

  return (
    <div
      className="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <DragAndDropFiles isDraggingOver={isDraggingOver} />
      <div className="w-full  h-full mt-24  py-8 relative">
        <SwitchLayout
          handleSortRecentItems={handleSortRecentItems}
          starredSort={starredSort}
          recentSort={recentSort}
          handleSortStarredItems={handleSortStarredItems}
          view={view}
          setView={setView}
          allData={items}
        />

        <div className="mt-4">
          {filteredItems.length > 0 ? (
            <>
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-4 overflow-hidden">
                  {filteredItems.map((folder) => (
                    <ChildFoldersViews
                      key={folder._id}
                      folder={folder}
                      allItems={items}
                      mode="normal"
                      handleOpen={handleOpen}
                    />
                  ))}
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
                      allItems={items}
                      handleOpen={handleOpen}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <EmptyFolderPage />
          )}
        </div>
      </div>

      <FileUploadProgress Allfolder={Allfolder} />
    </div>
  );
}

export default memo(RootFoldersViews);
