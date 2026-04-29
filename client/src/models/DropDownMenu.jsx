import { recycledFilebyId } from "@/api/fileApi";
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
  const {
    handleSharePublicLink,
    showShareModal,
    setShowShareModal,
    shareLink,
  } = useShare(items);

  const { handleAddStarred, handleSingleSoftDelete } = useAction({
    items,
    allItems,
  });

  return (
    <>
      <RenameModal
        open={open}
        setOpen={setOpen}
        allItems={allItems}
        items={items}
      />

      <CustomizedDialogs
        open={openInfoModal}
        setOpen={setOpenInfoModal}
        item={items}
      />
      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} items={items} />
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
              onClick={() =>
                (window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${items._id}?action=download`)
              }
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
            <DropdownMenuItem>
              <Copy size={16} />
              Copy
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                handleSharePublicLink;
                setShowShareModal(true);
              }}
            >
              <Share />
              Share
            </DropdownMenuItem>
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
              Folder info
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleSingleSoftDelete(items._id)}
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
