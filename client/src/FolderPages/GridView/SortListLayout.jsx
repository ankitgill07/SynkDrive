import { selectAll } from "@/lib/FolderSlice";
import { SelectionCheckbox } from "@/utils/Helpers";
import React, { useState } from "react";
import { FaSortDown } from "react-icons/fa";
import { useDispatch } from "react-redux";

function SortListLayout({ sortedByType, setSortedByType }) {
  const [allSelected, setAllSelected] = useState(false);
  const dispatch = useDispatch();

  return (
    <div>
      <div className="grid grid-cols-[auto_1fr_1fr_1fr_120px_50px] gap-4 px-1 py-3 border-b border-gray-200 text-sm bg-white  font-medium text-gray-800 uppercase tracking-wider">
        <div className="flex group  shrink-0 items-center justify-center w-8 mr-2">
          <button
            className="flex justify-center items-center "
            onClick={() => {
              dispatch(selectAll());
              setAllSelected(!allSelected);
            }}
          >
            {SelectionCheckbox({ isSelected: allSelected })}
          </button>
        </div>

        <div
          onClick={() => setSortedByType("name")}
          className="flex items-center cursor-pointer  font-medium rounded px-1 -ml-1 w-fit transition-colors"
        >
          Name <FaSortDown className="ml-1 mb-1" />
        </div>
        <div className="flex items-center">Owner</div>
        <div
          onClick={() => setSortedByType("updatedAt")}
          className="flex items-center cursor-pointer  rounded px-1 -ml-1 w-fit transition-colors"
        >
          Last Modified <FaSortDown className="ml-1 mb-1" />
        </div>
        <div
          onClick={() => setSortedByType("size")}
          className="flex items-center justify-end cursor-pointer  rounded   transition-colors"
        >
          Size
          <FaSortDown className="ml-1 mb-1" />
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default SortListLayout;
