import {
  bulkDeleteParmanetlyApi,
  bulkRestoreDataApi,
  getAllRecycleBinData,
  getRecycleDataByIdApi,
} from "@/api/RecycleBinApi";
import React, { useEffect, useState } from "react";
import RecycleFolderTree from "@/models/RecycleFolderTree";
import RowLayout from "./GridView/RawLayout";
import { ArrowDownToLine, Trash } from "lucide-react";
import { MdRestore } from "react-icons/md";
import { toast } from "sonner";
import { userAuth } from "@/contextApi/AuthContext";
import RecycleBinLayout from "./GridView/RecycleBinLayout";
import { useDispatch, useSelector } from "react-redux";
import { setFolders } from "@/lib/FolderSlice";
import useRecycle from "@/hooks/useRecycle";
import RecycleSortListLayout from "./GridView/RecycleSortListLayout";

function RecycleBin() {
  const { checkAuthorization } = userAuth();

  const {
    fetchRicycleData,
    fetchRicycleDataById,
    openRecycleFolder,
    setOpenRecycleFolder,
    seletectId,
  } = useRecycle();

  const items = useSelector((state) => state.recycleBin.recycleItems);
  const childItems = useSelector((state) => state.recycleBin.childFolderItems);

  const parentName = items.filter((data) => data._id === seletectId);
  const selectedIds = items
    .filter((item) => item.selected)
    .map((item) => item._id);

  const handleBulkDeletePermanetly = async () => {
    const result = await bulkDeleteParmanetlyApi(selectedIds);
    if (result.success) {
      toast.success(result.data);
      checkAuthorization();
      fetchRicycleData();
    } else {
      toast.error(result.message);
    }
  };

  const handleRestoreData = async () => {
    const { success, data } = await bulkRestoreDataApi(selectedIds);
    if (success) {
      toast.success(data);
      fetchRicycleData();
    }
  };

  return (
    <div className=" w-full">
      <div className=" flex items-center gap-x-3 mb-2">
        {selectedIds.length > 0 ? (
          <p className=" font-medium font-inter ">
            {selectedIds.length} selected:
          </p>
        ) : (
          ""
        )}
        <button
          onClick={handleBulkDeletePermanetly}
          className={`flex items-center gap-1 cursor-pointer
       font-inter bg-[#d9d4cc3b] text-gray-800 hover:bg-[#e9e8e8]
      rounded-full px-5 py-1.5 font-medium text-sm 
      transition-all duration-200`}
        >
          <Trash size={18} className="" />
          Delete
        </button>
        <button
          onClick={handleRestoreData}
          className={`flex items-center gap-1 cursor-pointer
       font-inter bg-[#d9d4cc3b] text-gray-800 hover:bg-[#e9e8e8]
      rounded-full px-5 py-1.5 font-medium text-sm 
      transition-all duration-200`}
        >
          <MdRestore size={18} className="" />
          Restore
        </button>
      </div>
      <div className="w-full pr-4">
        <RecycleSortListLayout />
        {items?.map((folder) => (
          <div onClick={() => fetchRicycleDataById(folder._id)}>
            <RecycleBinLayout
              key={folder._id}
              folder={folder}
              allItems={fetchRicycleData}
            />
          </div>
        ))}
      </div>
      <RecycleFolderTree
        open={openRecycleFolder}
        setOpen={setOpenRecycleFolder}
        parentItems={parentName[0]}
        allItems={childItems}
      />
    </div>
  );
}

export default RecycleBin;
