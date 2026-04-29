import React, { useState } from "react";
import { FaFolder, FaRegStar, FaStar } from "react-icons/fa";

import {
  SelectionCheckbox,
  formatSize,
  formatTimestamp,
  renderFilePreview,
} from "@/utils/Helpers";
import { DropdownMenuDestructive } from "@/models/DropDownMenu";
import { userAuth } from "@/contextApi/AuthContext";
import useFolder from "@/hooks/useFolder";
import useAction from "@/hooks/useAction";
import { useDispatch } from "react-redux";
import { toggleItems } from "@/lib/FolderSlice";

function RowLayout({ folder, allItems, }) {
  const { user } = userAuth();
  const dispatch = useDispatch();
  const { handleAddStarred } = useAction({
    items: folder,
    allItems,
  });

  const { handleOpen } = useFolder();


  return (
    <div className="">
      <div className="divide-y divide-gray-100">
        <div
          onClick={() => handleOpen(folder)}
          className={`
        group grid grid-cols-[40px_1fr_1fr_1fr_40px_100px_50px] gap-2 items-center  py-3.5 
        cursor-pointer transition-colors duration-150 border-b
        ${
          folder.selected
            ? "bg-blue-50 hover:bg-blue-50 border-blue-100"
            : "hover:bg-gray-50 border-gray-200"
        } 
      `}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              dispatch(toggleItems(folder._id));
            }}
            className="flex justify-center items-center h-full"
          >
            {SelectionCheckbox({ isSelected: folder.selected })}
          </div>

          {/* Column 2: Name */}
          <div className="flex items-center min-w-0">
            <div className="mr-3">
              {folder?.type === "folder" ? (
                <FaFolder size={22} className="text-[#3F8EFC]" />
              ) : (
                renderFilePreview({ file: folder, size: 22 })
              )}
            </div>
            <span className="truncate text-sm font-medium text-gray-700">
              {folder?.name}
            </span>
          </div>

          {/* Column 3: Owner */}
          <div className="flex items-center text-sm text-gray-500">
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-xs font-bold text-gray-600 border border-gray-200">
              {folder.userId === user.id && (
                <img
                  className="rounded-full object-cover w-full h-full"
                  src={user.picture}
                  alt="user"
                />
              )}
            </div>
            <span className="truncate text-xs font-inter">Me</span>
          </div>

          {/* Column 4: Date */}
          <div className="text-sm font-inter text-gray-500 truncate font-medium">
            {formatTimestamp(folder?.updatedAt)}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAddStarred(folder._id);
            }}
            className="flex justify-center items-center cursor-pointer"
          >
            {folder.isStarred ? (
              <FaStar className="text-yellow-400 text-sm" />
            ) : (
              <FaRegStar className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity text-sm hover:text-gray-600" />
            )}
          </div>

          {/* Column 6: Size */}
          <div className="text-sm text-gray-500 text-right font-medium">
            {formatSize(folder.size)}
          </div>

          {/* Column 7: Action Menu */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex justify-center"
            title="More actions"
          >
            <DropdownMenuDestructive items={folder} allItems={allItems} />
          </div>
        </div>
      </div>
      {/* Empty state filler (optional) */}
      {folder.length === 0 && (
        <div className="p-10 text-center text-gray-400 text-sm">
          Folder is empty
        </div>
      )}
    </div>
  );
}

export default RowLayout;
