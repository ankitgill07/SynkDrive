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
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-1 gap-y-4 overflow-hidden ">
        {allItems?.map((folder) => (
          <ChildFoldersViews
            key={folder._id}
            folder={folder}
            allItems={fetchStarredItmes}
            mode="normal"
          />
        ))}
      </div>
    </div>
  );
}

export default StarredPage;
