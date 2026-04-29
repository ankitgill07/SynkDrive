import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FaFolder } from "react-icons/fa";
import { formatSize, renderFilePreview } from "@/utils/Helpers";
import { useSelector } from "react-redux";
import { restoreDataApi, restoreFoldersApi } from "@/api/RecycleBinApi";
import { useSnackbar } from "@/contextApi/SnackbarContext";
import useRecycle from "@/hooks/useRecycle";
import { toast } from "sonner";

export default function RecycleFolderTree({
  open,
  setOpen,
  allItems,
  parentItems,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const { fetchRicycleData } = useRecycle();
  const handleRestoreData = async (id) => {
    const result =
      parentItems.type === "folder"
        ? await restoreFoldersApi(id)
        : await restoreDataApi(id);
    if (result.success) {
      handleClose();
      fetchRicycleData();
      toast.success(`Restored ${parentItems.name}`);
    } else {
      toast.error(result.message);
    }
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        style={{ maxHeight: "calc(100% - 200px)" }}
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{ paddingBottom: "0px", paddingTop: "25px" }}
        >
          <p>{parentItems?.name}</p>
        </DialogTitle>
        <DialogContent
          dividers={"paper"}
          style={{
            border: "2px solid #0000001F",
            margin: "25px",
            padding: "0px",
          }}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            style={{ padding: "0px" }}
            tabIndex={-1}
          >
            {allItems?.map((item) => {
              return (
                <div>
                  <div className="grid grid-cols-2 items-center border-b px-4 py-3 cursor-pointer  hover:bg-gray-50 transition">
                    <div className="flex items-center gap-x-4">
                      {item.type === "folder" ? (
                        <FaFolder
                          size={37}
                          className="text-[#3F8EFC] flex-shrink-0"
                        />
                      ) : (
                        renderFilePreview({ file: item, size: 35 })
                      )}
                      <div className="flex flex-col">
                        <p className="text-gray-800 text-sm line-clamp-1 font-medium">
                          {item.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-x-6">
                      <p className="text-gray-600 text-sm">
                        {item?.type === "file" ? formatSize(item?.size) : ""}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ margin: "20px", marginTop: "0px" }}>
          <button
            className="bg-[#DAD4CD3B] px-4 rounded-md hover:bg-[#a19e9b3b] font-inter font-bold cursor-pointer  text-sm  py-1.5 "
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 rounded-md font-inter font-bold cursor-pointer  text-sm  py-1.5 "
            onClick={() => handleRestoreData(parentItems._id)}
          >
            Restore All File
          </button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
