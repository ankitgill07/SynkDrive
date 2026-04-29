import React, { useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FolderPlus, PencilIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { renameFolderNameApi } from "@/api/FolderApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { renameFileNameApi } from "@/api/fileApi";
import { useSnackbar } from "@/contextApi/SnackbarContext";

function RenameModal({ open, setOpen, items, allItems }) {
  const { register, handleSubmit, reset, setFocus } = useForm({
    defaultValues: {
      name: items.name,
    },
  });

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setFocus("name");
      }, 0);
    }
  }, [open]);

  const submitForm = async (data) => {
    try {
      const type = await items.type;
      const result =
        type === "folder"
          ? await renameFolderNameApi(items._id, data)
          : await renameFileNameApi(items._id, data);
      if (result.success) {
        setOpen(false);
        allItems();
        showSnackbar(`${items.name} Rename ${data.name}`);
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="draggable-dialog-title"
        style={{ borderRadius: "30px" }}
      >
        <form onSubmit={handleSubmit(submitForm)}>
          <DialogTitle
            style={{ width: "400px", padding: "20px", paddingBottom: "3px" }}
            id="draggable-dialog-title"
          >
            Rename
          </DialogTitle>
          <DialogContent style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <DialogContentText style={{ marginTop: "10px" }}>
              <input
                {...register("name", { required: true })}
                name="name"
                type="text"
                className="
    w-full
 rounded-md 
    border border-gray-600
    bg-white
    px-3
    py-2.5
font-inter
    text-gray-900
    placeholder:text-gray-500
    transition
    duration-150
    ease-in-out
    focus:outline-none
    focus-visible:border-[#155DFC]
    focus-visible:ring-2
    focus-visible:ring-[#155DFC]/80

    disabled:bg-gray-500
    disabled:text-gray-400
    disabled:cursor-not-allowed
  "
                placeholder="Folder name"
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ padding: "20px", paddingTop: "14px" }}>
            <button
              onClick={() => {
                setOpen(false);
              }}
              type="button"
              className=" bg-[#d9d4cc3b] px-4.5  hover:bg-[#e9e8e8] py-1.5  rounded-md cursor-pointer text-black font-inter font-medium "
            >
              Cancel
            </button>
            <button
              type="submit"
              className=" bg-[#155dfc] px-4.5  py-1.5  rounded-md cursor-pointer text-white font-inter font-medium "
            >
              Rename
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

export default RenameModal;
