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
import useFolder from "@/hooks/useFolder";
import { toast } from "sonner";

export default function DeleteAlrightModal({
  openDelete,
  setOpenDelete,
  items,
  allItems,
}) {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleDeletePermanetly = async (id) => {
    const type = items.type;
    const result =
      type === "folder" ? await deleteFolderApi(id) : await deleteFileApi(id);
    allItems();
    setOpenDelete(false);
    if (result.success) {
      toast.success(result.success);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
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
          >
            Cancle
          </button>
          <button
            className=" px-4 py-1.5 bg-red-600 text-white font-inter font-medium cursor-pointer rounded-full  "
            onClick={() => handleDeletePermanetly(items._id)}
            autoFocus
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
