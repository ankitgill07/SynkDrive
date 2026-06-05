import {
  uploadCompletedApi,
  uploadFileS3Buket,
  uploadInitiateApi,
} from "@/api/fileApi";
import useGlobalProgress from "@/hooks/useGlobalProgress";
import { createContext, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { userAuth } from "./AuthContext";

const FileProgressContext = createContext(null);

export const FileProgressProvider = ({ children }) => {
  const { progress, setProgress, updateProgress } = useGlobalProgress();
  const { user } = userAuth();
  const { id } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const processFiles = async (selectedFiles) => {
    if (selectedFiles.length === 0) return;
    handleClose();
    try {
      for (const file of selectedFiles) {
        if (file.size > user.maxFileSize) {
          toast.error(`${file.name} is larger than 200mb, skipped`);
          continue;
        }
        const result = await uploadInitiateApi(id, {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        const { uploadUrl, fileId } = result?.data;
        setProgress((prev) => [
          ...prev,
          {
            id: fileId,
            name: file.name,
            size: file.size,
            progress: 0,
            type: file.type,
          },
        ]);

        const s3Result = await uploadFileS3Buket(
          uploadUrl,
          fileId,
          file,
          updateProgress,
        );
        if (s3Result === 200) {
          await uploadCompletedApi(fileId);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    await processFiles(selectedFiles);
  };

  return (
    <FileProgressContext.Provider
      value={{
        handleFileChange,
        processFiles,
        progress,
        handleClick,
        open,
        anchorEl,
        handleClose,
      }}
    >
      {children}
    </FileProgressContext.Provider>
  );
};

export const useFileProgress = () => {
  const context = useContext(FileProgressContext);

  if (!context) {
    throw new Error("useFileProgress must be used within FileProgressProvider");
  }

  return context;
};
