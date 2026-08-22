
import DraggableDialog from "@/models/AlertDialogDemo";
import FadeMenu from "@/models/BasicMenu";
import { ArrowUpFromLine, ChevronDown, FolderPlus, Plus } from "lucide-react";
import React from "react";
import { HiMiniSlash } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import GoogleDriveImport from "../imports/GoogleDriveImport";

import { useSelector } from "react-redux";

function ActionCard({ Allfolder , breadCrumb}) {

  const location = useLocation();
  const items = useSelector((state) => state.folder.items);
  const selectedCount = items.filter((item) => item.selected).length;
 
  return (
    <div className="w-full">
      <div className="fixed top-16 lg:top-[72px] left-0 lg:left-64 w-full lg:w-[calc(100%-256px)] h-14 lg:h-16 z-20 flex justify-between items-center bg-white px-4 sm:px-5 py-0 border-b border-gray-100">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pr-4 min-w-0">
          <Link
            to="/drive/home"
            className="text-base sm:text-lg font-semibold hover:text-black transition shrink-0"
          >
           My Drive
          </Link>
          {breadCrumb?.map((folder, index) => (
            <div key={folder._id} className="flex items-center gap-1 shrink-0">
              <HiMiniSlash size={18} className="text-gray-400" />
              <Link
                to={`/drive/folder/${folder._id}`}
                className={`text-base sm:text-lg font-medium hover:text-black transition shrink-0 ${
                  location.pathname === `/drive/folder/${folder._id}`
                    ? "text-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                {folder.name}
              </Link>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-x-1.5 sm:gap-x-2 shrink-0 ml-2">
          <FadeMenu Allfolder={Allfolder} />
          <DraggableDialog Allfolder={Allfolder} />
          <GoogleDriveImport Allfolder={Allfolder} />
        </div>
      </div>
    </div>
  );
}

export default ActionCard;
