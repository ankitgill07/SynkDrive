import { selectAllTrashData } from "@/lib/RecycleSlice";
import { SelectionCheckbox } from "@/utils/Helpers";
import React, { useState } from "react";
import { FaSortDown } from "react-icons/fa";
import { useDispatch } from "react-redux";

function RecycleSortListLayout() {
  const [allSelected, setAllSelected] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className="bg-white">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-0.5 py-3 border-b border-gray-00 text-sm font-medium font-inter text-gray-500 uppercase tracking-wider">
        <div className="flex items-center">
          <div className="flex group  shrink-0 items-center justify-center w-8 mr-2">
            <button
              type="button"
              onClick={() => {
                dispatch(selectAllTrashData());
                setAllSelected(!allSelected);
              }}
            >
              {SelectionCheckbox({ isSelected: allSelected })}
            </button>
          </div>

          <div
            onClick={() => setSortedByType("name")}
            className="flex items-center cursor-pointer font-inter  hover:text-gray-800 transition-colors"
          >
            Name <FaSortDown className="ml-1 mb-0.5" />
          </div>
        </div>
        <div className="w-[100px] text-center">Deleted by</div>

        <div
          onClick={() => setSortedByType("updatedAt")}
          className="flex items-center justify-end cursor-pointer hover:text-gray-800 transition-colors"
        >
          Date deleted <FaSortDown className="ml-1 mb-0.5" />
        </div>
      </div>
    </div>
  );
}

export default RecycleSortListLayout;
