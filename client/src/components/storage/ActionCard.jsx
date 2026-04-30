import useFolder from "@/hooks/useFolder";
import DraggableDialog from "@/models/AlertDialogDemo";
import FadeMenu from "@/models/BasicMenu";
import { ArrowUpFromLine, ChevronDown, FolderPlus, Plus } from "lucide-react";
import React from "react";
import { HiMiniSlash } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import GoogleDriveImport from "../imports/GoogleDriveImport";

function ActionCard({ Allfolder }) {
  const { breadCrumb } = useFolder();
  const location = useLocation();
 
  return (
    <div className="w-full">
      <div className="fixed  top-18  left-65 w-[calc(100%-260px)] z-10 flex justify-between items-center bg-white px-5  py-4 ">
        <div className="flex items-center gap-1">
          <Link
            to="/drive/home"
            className="text-lg font-semibold hover:text-black transition"
          >
            Drive
          </Link>
          {breadCrumb?.map((folder, index) => (
            <div key={folder._id} className="flex items-center gap-1">
              <HiMiniSlash size={18} className="text-gray-400" />
              <Link
                to={`/drive/folder/${folder._id}`}
                className={`text-lg font-medium hover:text-black transition ${
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
        <div className="flex items-center gap-x-2">
          <FadeMenu Allfolder={Allfolder} />
          <DraggableDialog Allfolder={Allfolder} />
          <GoogleDriveImport Allfolder={Allfolder} />
        </div>
      </div>
    </div>
  );
}

export default ActionCard;
