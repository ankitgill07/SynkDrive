
import { toggleData } from "@/lib/RecycleSlice";
import {
  formatTimestamp,
  renderFilePreview,
  SelectionCheckbox,
} from "@/utils/Helpers";
import React from "react";
import { FaFolder } from "react-icons/fa";
import { useDispatch } from "react-redux";

function RecycleBinLayout({ folder }) {
  const dispatch = useDispatch();


  return (
<div className="w-full pr-4 ">
  <div
    className={`
      group grid grid-cols-[1fr_auto_1fr] items-center py-4 pr-6
      cursor-pointer transition-colors duration-150 border-b
      ${
        folder.selected
          ? "bg-blue-50 hover:bg-blue-50 border-blue-100" 
          : "hover:bg-gray-50 border-gray-200" 
      }
    `}
  >
    <div className="flex items-center min-w-0">
      <div
        onClick={(e) => {
          e.stopPropagation();
          dispatch(toggleData(folder._id));
        }}
        className="flex shrink-0 items-center justify-center w-8 mr-2"
      >
        {SelectionCheckbox({ isSelected: folder.selected })}
      </div>

      <div className="flex items-center min-w-0">
        <div className="mr-3 shrink-0">
          {folder?.type === "folder" ? (
            <FaFolder size={20} className="text-[#3F8EFC]" />
          ) : (
            renderFilePreview({ file: folder, size: 23 })
          )}
        </div>
        <span className="truncate text-sm font-medium text-gray-700">
          {folder?.name}
        </span>
      </div>
    </div>
    <div className="w-[80px] text-center text-sm font-medium text-black font-inter">
      You
    </div>
    <div className="text-right text-sm text-gray-500 font-medium font-inter truncate">
      {formatTimestamp(folder?.updatedAt)}
    </div>
  </div>
</div>
  );
}

export default RecycleBinLayout;
