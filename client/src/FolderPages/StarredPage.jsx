import React, { useEffect, useState } from "react";
import ChildFoldersViews from "./FolderCard";
import { getStarredDataApi } from "@/api/StarredApi";

function StarredPage() {
  const [starredFiles, setStarredFiles] = useState([]);
  const [starredFolders, setStarredFolders] = useState([]);

  const fetchStarredItmes = async () => {
    const result = await getStarredDataApi();
    setStarredFiles(result.files);
    setStarredFolders(result.folders);
  };

  const allItems = [...starredFiles, ...starredFolders];

  useEffect(() => {
    fetchStarredItmes();
  }, []);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Starred Folders Section */}
      {starredFolders.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Folders
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {starredFolders.map((folder) => (
              <ChildFoldersViews
                key={folder._id}
                folder={folder}
                allItems={fetchStarredItmes}
                mode="normal"
                hideCheckbox={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Starred Files Section */}
      {starredFiles.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
            Files
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 overflow-hidden">
            {starredFiles.map((file) => (
              <ChildFoldersViews
                key={file._id}
                folder={file}
                allItems={fetchStarredItmes}
                mode="normal"
                hideCheckbox={true}
              />
            ))}
          </div>
        </div>
      )}

      {starredFolders.length === 0 && starredFiles.length === 0 && (
        <div className="h-64 flex flex-col justify-center items-center text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
          <p className="text-sm font-medium">No starred files or folders</p>
        </div>
      )}
    </div>
  );
}

export default StarredPage;
