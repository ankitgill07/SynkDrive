import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { deleteFileApi, deleteFolderApi } from "@/api/RecycleBinApi";

import { toast } from "sonner";

export default function DeleteAlrightModal({
  openDelete,
  setOpenDelete,
  items,
  allItems,
}) {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeletePermanetly = async (id) => {
    setIsDeleting(true);
    try {
      const type = items.type;
      const result =
        type === "folder" ? await deleteFolderApi(id) : await deleteFileApi(id);
      if (result.success) {
        toast.success(result.success);
        allItems();
        setOpenDelete(false);
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Failed to delete permanently");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={openDelete}
        onClose={() => !isDeleting && setOpenDelete(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete Forever?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {items.name} will be deleted forever.This can't be restore
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className=" px-4 py-1.5 bg-gray-100  font-inter font-medium cursor-pointer rounded-full  "
            autoFocus
            onClick={() => setOpenDelete(false)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            className=" px-4 py-1.5 bg-red-600 text-white font-inter font-medium cursor-pointer rounded-full flex items-center gap-1.5"
            onClick={() => handleDeletePermanetly(items._id)}
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting && (
              <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
            )}
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
