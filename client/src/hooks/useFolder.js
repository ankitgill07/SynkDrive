import { getAllFoldersApi } from "@/api/FolderApi";
import { setFolders } from "@/lib/FolderSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFilePreview } from "@/contextApi/FilePreviewContext";

function useFolder() {
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [starred, setStarred] = useState(false);
  const dispatch = useDispatch();
  const { previewFile } = useFilePreview();

  const { id } = useParams();
  const navigate = useNavigate();

  const Allfolder = async () => {
    const result = await getAllFoldersApi(id || "");
    const { folders, files, path } = result.data;
    const allItems = [...folders, ...files].sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return 0;
    });
    setBreadCrumb(path);
    dispatch(setFolders(allItems));
  };

  useEffect(() => {
    Allfolder();
  }, [id]);

  const handleOpen = (folder) => {
    if (folder.type === "folder") {
      return navigate(`/drive/folder/${folder._id}`);
    } else if (folder.type === "file") {
      previewFile(folder);
    }
  };

  return { Allfolder, breadCrumb, handleOpen, starred, setStarred };
}

export default useFolder;
