import React, { useEffect, useMemo, useState } from "react";
import { FaFolder } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import ChildFoldersViews from "./FolderCard";
import ActionCard from "../components/storage/ActionCard";
import FileUploadProgress from "@/models/FileUploadProgress";
import RawLayout from "./GridView/RawLayout";
import SwitchLayout from "./GridView/SwitchLayout";
import SortListLayout from "./GridView/SortListLayout";
import { bulkSoftDeleteFileApi } from "@/api/RecycleBinApi";
import { toast } from "sonner";
import { bulkDownloadFileApi } from "@/api/fileApi";
import { useDispatch, useSelector } from "react-redux";

function RootFoldersViews({ folderData, Allfolder }) {
  const [view, setView] = useState(localStorage.getItem("view") || "grid");
  const [starredSort, setStarredSort] = useState(false);
  const [recentSort, setRecentSort] = useState(false);
  const [sortedByType, setSortedByType] = useState(" ");

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
    <div>
      <div className="w-full mt-24 pr-3 py-8 relative  ">
        <SwitchLayout
          handleSortRecentItems={handleSortRecentItems}
          starredSort={starredSort}
          recentSort={recentSort}
          handleSortStarredItems={handleSortStarredItems}
          view={view}
          setView={setView}
          allData={Allfolder}
        />
        <div>
          {view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-1 gap-y-4 overflow-hidden ">
              {filteredItems?.map((folder) => (
                <ChildFoldersViews
                  key={folder._id}
                  folder={folder}
                  allItems={Allfolder}
                  mode="normal"
                />
              ))}
            </div>
          ) : (
            <div className=" w-full font-inter ">
              <SortListLayout
                sortedByType={sortedByType}
                setSortedByType={setSortedByType}
              />
              {filteredItems.map((folder) => (
                <RawLayout
                  key={folder._id}
                  folder={folder}
                  allItems={Allfolder}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <FileUploadProgress allItems={Allfolder} />
    </div>
  );
}

export default RootFoldersViews;
