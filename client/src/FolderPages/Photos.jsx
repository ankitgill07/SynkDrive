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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 overflow-hidden">
      {allPhotos?.map((folder) => (
        <ChildFoldersViews
          key={folder._id}
          folder={folder}
          allItems={fetchRicycleData}
          mode="normal"
          hideCheckbox={true}
        />
      ))}
    </div>
  );
}

export default Photos;
