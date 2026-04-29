import React, { useEffect, useState } from "react";
import ChildFoldersViews from "./FolderCard";
import { getAllPhotosApi } from "@/api/PhotosApi";

function Photos() {
  const [allPhotos, setAllPhotos] = useState([]);

  const fetchRicycleData = async () => {
    const result = await getAllPhotosApi();
    setAllPhotos(result.photos);
  };

  useEffect(() => {
    fetchRicycleData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-1 gap-y-4 overflow-hidden ">
      {allPhotos?.map((folder) => (
        <ChildFoldersViews
          key={folder._id}
          folder={folder}
          allItems={fetchRicycleData}
          mode="normal"
        />
      ))}
    </div>
  );
}

export default Photos;
