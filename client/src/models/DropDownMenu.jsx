import { recycledFilebyId, getDownloadUrlApi } from "@/api/fileApi";
import { softDeleteFolderApi } from "@/api/FolderApi";
import { addFileToStarred, addFolderTreeStarredApi } from "@/api/StarredApi";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CustomizedDialogs from "@/FolderPages/InfoDialogsModal";
import RenameModal from "@/FolderPages/RenameModal";
import {
  Copy,
  Download,
  Info,
  PencilIcon,
  Share,
  ShareIcon,
  Star,
  TrashIcon,
} from "lucide-react";
import React, { useState } from "react";
import { IoMdMore } from "react-icons/io";
import { toast } from "sonner";
import { useSnackbar } from "@/contextApi/SnackbarContext";
import useAction from "@/hooks/useAction";

import useShare from "@/hooks/useShare";
import ShareModal from "./ShareModal";

export function DropdownMenuDestructive({ items, allItems }) {
  const [open, setOpen] = React.useState(false);
  const [openInfoModal, setOpenInfoModal] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const {
    showShareModal,
    setShowShareModal,
    openShareModal,
    activeTab,
    setActiveTab,
    linkEnabled,
    linkPermission,
    handleToggle,
    shareLink,
    handleCopyLink,
    handleChangePermission,
    copied,
    isLoading,
    handleSendFileWithEmail,
    setEmail,
    email,
    shareByEmail,
  } = useShare(items);

  const { handleAddStarred, handleSingleSoftDelete } = useAction({
    items,
    allItems,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await handleSingleSoftDelete(items._id);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <>
      <RenameModal
        open={open}
        setOpen={setOpen}
        allItems={allItems}
        items={items}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete {items.type === "folder" ? "Folder" : "File"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to move this {items.type} to the Recycle Bin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="bg-secondary text-foreground border-border hover:bg-secondary/80">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CustomizedDialogs
        open={openInfoModal}
        setOpen={setOpenInfoModal}
        item={items}
      />
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} 
        items={items} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        linkEnabled={linkEnabled}
        linkPermission={linkPermission}
        handleToggle={handleToggle}
        shareLink={shareLink}
        handleCopyLink={handleCopyLink}
        handleChangePermission={handleChangePermission}
        copied={copied}
        isLoading={isLoading}
        handleSendFileWithEmail={handleSendFileWithEmail}
        setEmail={setEmail}
        email={email}
        shareByEmail={shareByEmail}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="
        p-1
              rounded-full
              hover:bg-[#dfdddb]
              transition
              cursor-pointer
              outline-0"
            variant="outline"
          >
            <IoMdMore size={20} className="text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const res = await getDownloadUrlApi(items._id);
                  if (res?.downloadUrl) {
                    const a = document.createElement("a");
                    a.href = res.downloadUrl;
                    a.download = items.name;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  } else {
                    toast.error("Failed to get download link");
                  }
                } catch (err) {
                  toast.error("Error downloading file");
                }
              }}
            >
              <Download />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpen(true);
              }}
            >
              <PencilIcon size={16} />
              Rename
            </DropdownMenuItem>

          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {items.type === "file" && (
              <DropdownMenuItem
                onClick={() => {
                  openShareModal(true);
                }}
              >
                <Share />
                Share
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleAddStarred(items._id)}>
              {items.isStarred ? <FaStar /> : <Star />}

              {items.isStarred ? "unStarred" : "Starred"}
            </DropdownMenuItem>
             <DropdownMenuItem
              onClick={() => {
                setOpenInfoModal(true);
              }}
            >
              <Info />
              {items.type === "folder" ? "Folder info" : "File info"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmOpen(true);
              }}
            >
              <TrashIcon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
