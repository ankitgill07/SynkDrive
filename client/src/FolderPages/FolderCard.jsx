import React, { useEffect, useState, memo } from "react";
import ActionCard from "../components/storage/ActionCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllFoldersApi } from "@/api/FolderApi";
import { FaFolder } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { renderFilePreview, SelectionCheckbox } from "../utils/Helpers";
import { DropdownMenuDestructive } from "@/models/DropDownMenu";
import RecycleDownMenu from "@/models/RecycleDownMenu";
import RecycleFolderTree from "@/models/RecycleFolderTree";
import { useDispatch, useSelector } from "react-redux";
import { toggleItems } from "@/lib/FolderSlice";
import { toggleData } from "@/lib/RecycleSlice";
import { useFilePreview } from "@/contextApi/FilePreviewContext";

function ChildFoldersViews({ folder, allItems, mode, handleOpen, hideCheckbox }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { previewFile } = useFilePreview();

  const items = useSelector((state) => state.folder.items);
  const isSelectionMode = items.some((item) => item.selected);

  const defaultHandleOpen = (item) => {
    if (item.type === "folder") {
      navigate(`/drive/folder/${item._id}`);
    } else if (item.type === "file") {
      previewFile(item);
    }
  };

  if (folder?.type === "folder") {
    return (
      <div 
        onClick={() => handleOpen ? handleOpen(folder) : defaultHandleOpen(folder)}
        className="relative group cursor-pointer rounded-xl hover:shadow-md p-3.5 transition duration-200 border-2 bg-[#F7F5F2] hover:bg-[#EBE9E6] border-transparent"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <FaFolder
              size={22}
              className="text-[#3F8EFC] shrink-0 transition-transform group-hover:scale-110"
            />
            <span className="text-sm font-semibold text-gray-800 truncate">
              {folder?.name}
            </span>
          </div>
          <div onClick={(e) => e.stopPropagation()} title="More actions" className="shrink-0">
            {mode === "normal" ? (
              <DropdownMenuDestructive items={folder} allItems={allItems} />
            ) : (
              <RecycleDownMenu items={folder} allItems={allItems} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div>
          <div 
            onClick={() => handleOpen ? handleOpen(folder) : defaultHandleOpen(folder)}
            className="relative group h-58 cursor-pointer rounded-lg hover:shadow-sm p-2.5 pb-0 transition border-2 bg-[#F7F5F2] hover:bg-[#EBE9E6] border-transparent"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="shrink-0">
                  {renderFilePreview({ file: folder, size: 22 })}
                </div>
                <span className="text-sm font-medium text-gray-800 truncate">
                  {folder?.name}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()} title="More actions" className="shrink-0">
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
              {renderFilePreview({ file: folder, size: 110 })}
            </div>
          </div>
        </div>
      </div>
  );
}

export default memo(ChildFoldersViews);
