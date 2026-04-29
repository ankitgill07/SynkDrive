import React, { useState } from "react";
import { MdRestore } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdMore } from "react-icons/io";
import { TrashIcon } from "lucide-react";
import { restoreDataApi, restoreFoldersApi } from "@/api/RecycleBinApi";
import DeleteAlrightModal from "./DeleteAlrightModal";
import RecycleFolderTree from "./RecycleFolderTree";
import { useSnackbar } from "@/contextApi/SnackbarContext";

function RecycleDownMenu({ items, allItems }) {
  const [openDelete, setOpenDelete] = useState(false);



  return (
    <>
      <DeleteAlrightModal
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        allItems={allItems}
        items={items}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="
        p-1
              rounded-full
              hover:bg-[#dfdddb]
              transition
              cursor-pointer
              outline-0
              flex-shrink-0"
            variant="outline"
          >
            <IoMdMore size={20} className="text-gray-600" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                handleRestoreData(items._id);
              }}
            >
              <MdRestore />
              Restore
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(true);
              }}
            >
              <TrashIcon />
              Delete Permanetly
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default RecycleDownMenu;
