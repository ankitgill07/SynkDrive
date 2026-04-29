import { recycledFilebyId } from "@/api/fileApi";
import { softDeleteFolderApi } from "@/api/FolderApi";
import { bulkSoftDeleteFileApi } from "@/api/RecycleBinApi";
import { addFileToStarred, addFolderTreeStarredApi } from "@/api/StarredApi";
import { useSnackbar } from "@/contextApi/SnackbarContext";
import React, { useState } from "react";
import { toast } from "sonner";

function useAction({ items, allItems }) {
  const [starred, setStarred] = useState(items.isStarred);
  const { showSnackbar } = useSnackbar();

  const type = items?.type;

  const handleSingleSoftDelete = async (id) => {
    const result =
      type === "folder"
        ? await softDeleteFolderApi(id)
        : await recycledFilebyId(id);

    if (result?.success) {
      showSnackbar(`${items.type} moved to Recycle Bin`);
      allItems();
    } else {
      toast.error(result?.error);
    }
  };

  const handleAddStarred = async (id) => {
    const newValue = !starred;
    setStarred(newValue);
    const result =
      type === "folder"
        ? await addFolderTreeStarredApi(id, newValue)
        : await addFileToStarred(id, newValue);
    if (result?.success) {
      showSnackbar(
        starred ? `${type}  removed  to starred` : `${type} added  to starred`,
      );
      allItems();
    } else {
      toast.error(result?.error);
    }
  };

  return {
    handleAddStarred,
    handleSingleSoftDelete,
  };
}

export default useAction;
