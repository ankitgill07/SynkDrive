import { selectAll, deselectAll } from "@/lib/FolderSlice";
import { SelectionCheckbox } from "@/utils/Helpers";
import React from "react";
import { FaSortDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function SortListLayout({ sortedByType, setSortedByType }) {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.folder.items);
  const totalCount = items.length;
  const selectedCount = items.filter((item) => item.selected).length;

  let checkboxState = false;
  if (selectedCount > 0) {
    if (selectedCount === totalCount) {
      checkboxState = true;
    } else {
      checkboxState = "indeterminate";
    }
  }

  return (
    <div>
      <div className="grid grid-cols-[40px_1fr_40px] sm:grid-cols-[40px_1fr_120px_40px_80px_40px] md:grid-cols-[40px_1fr_120px_150px_40px_80px_40px] gap-2 sm:gap-3 md:gap-4 px-1 py-3 border-b border-gray-200 text-sm bg-white font-medium text-gray-800 uppercase tracking-wider">
        <div className="flex group shrink-0 items-center justify-center w-8 mr-2">
          <button
            className="flex justify-center items-center "
            onClick={() => {
              if (selectedCount === totalCount && totalCount > 0) {
                dispatch(deselectAll());
              } else {
                dispatch(selectAll());
              }
            }}
          >
            {SelectionCheckbox({ isSelected: checkboxState })}
          </button>
        </div>

        <div
          onClick={() => setSortedByType("name")}
          className="flex items-center cursor-pointer font-medium rounded px-1 -ml-1 w-fit transition-colors"
        >
          Name <FaSortDown className="ml-1 mb-1" />
        </div>
        <div className="hidden sm:flex items-center">Owner</div>
        <div
          onClick={() => setSortedByType("updatedAt")}
          className="hidden md:flex items-center cursor-pointer rounded px-1 -ml-1 w-fit transition-colors"
        >
          Last Modified <FaSortDown className="ml-1 mb-1" />
        </div>
        <div className="hidden sm:block"></div>
        <div
          onClick={() => setSortedByType("size")}
          className="hidden sm:flex items-center justify-end cursor-pointer rounded transition-colors"
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
