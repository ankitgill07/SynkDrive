import { selectAllTrashData, deselectAllTrashData } from "@/lib/RecycleSlice";
import { SelectionCheckbox } from "@/utils/Helpers";
import React from "react";
import { FaSortDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

function RecycleSortListLayout() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.recycleBin.recycleItems);
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
    <div className="bg-white">
      <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[1fr_auto_1fr] items-center px-0.5 py-3 border-b border-gray-100 text-sm font-medium font-inter text-gray-500 uppercase tracking-wider">
        <div className="flex items-center">
          <div className="flex group  shrink-0 items-center justify-center w-8 mr-2">
            <button
              type="button"
              onClick={() => {
                if (selectedCount === totalCount && totalCount > 0) {
                  dispatch(deselectAllTrashData());
                } else {
                  dispatch(selectAllTrashData());
                }
              }}
            >
              {SelectionCheckbox({ isSelected: checkboxState })}
            </button>
          </div>

          <div
            onClick={() => setSortedByType("name")}
            className="flex items-center cursor-pointer font-inter  hover:text-gray-800 transition-colors"
          >
            Name <FaSortDown className="ml-1 mb-0.5" />
          </div>
        </div>
        <div className="hidden sm:block w-[100px] text-center">Days Left</div>

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
