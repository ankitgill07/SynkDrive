import React, { useEffect, useState } from "react";
import ActionCard from "../components/storage/ActionCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllFoldersApi } from "@/api/FolderApi";
import { FaFolder } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { renderFilePreview } from "../utils/helpers";
import { DropdownMenuDestructive } from "@/models/DropDownMenu";
import RecycleDownMenu from "@/models/RecycleDownMenu";
import RecycleFolderTree from "@/models/RecycleFolderTree";
import useFolder from "@/hooks/useFolder";

function ChildFoldersViews({ folder, allItems, mode }) {
  const { handleOpen } = useFolder();

  return (
    <div>
      <div className="w-58">
        <div onClick={() => handleOpen(folder)}>
          <div className="h-58 cursor-pointer rounded-lg hover:shadow-sm bg-[#F7F5F2] p-2.5 pb-0 transition hover:bg-[#EBE9E6] ">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3 min-w-0">
                {folder?.type === "folder" ? (
                  <FaFolder
                    size={22}
                    className="text-[#3F8EFC] font-plusjakartaSans"
                  />
                ) : (
                  renderFilePreview({ file: folder, size: 22 })
                )}
                <span className="text-sm font-medium text-gray-800 truncate">
                  {folder?.name}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()} title="More actions">
                {mode === "normal" ? (
                  <DropdownMenuDestructive items={folder} allItems={allItems} />
                ) : (
                  <RecycleDownMenu items={folder} allItems={allItems} />
                )}
              </div>
            </div>

            <div
              className="
              mt-2.5 h-[calc(100%-52px)] rounded-md bg-white
              flex items-center justify-center overflow-hidden 
            "
            >
              {folder.type === "folder" ? (
                <FaFolder size={110} className="text-[#3F8EFC] opacity-90" />
              ) : (
                renderFilePreview({ file: folder, size: 110 })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildFoldersViews;
