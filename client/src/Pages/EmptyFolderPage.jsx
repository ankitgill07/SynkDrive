import { Upload } from "lucide-react";
import DraggableDialog from "@/models/AlertDialogDemo";
import { useFileProgress } from "@/contextApi/FileProgress";
import React from "react";

export default function EmptyFolderPage({ Allfolder }) {
  const { handleFileChange } = useFileProgress();

  return (
    <div>
      <div className="flex flex-col items-center justify-center pt-20 gap-4 text-[#bbb]">
        <div className="text-[52px]">📂</div>
        <div className="text-[16px] font-semibold text-[#444]">
          This folder is empty
        </div>

        <div className="text-[13px] text-slate-400 text-center">
          Drag files from your computer into the folder zone, or upload using the buttons below.
        </div>

        <div className="flex gap-2.5 items-center">
          <DraggableDialog Allfolder={Allfolder} />

          <button className="btn flex items-center gap-1.5 px-[18px] py-[9px] bg-[#1a73e8] border-0 rounded-[10px] text-[13px] font-semibold text-white relative overflow-hidden cursor-pointer">
            <Upload size={16} />
            <span>Upload Files</span>
            <input
              type="file"
              className="absolute left-0 top-0 w-full h-full cursor-pointer opacity-0"
              multiple
              onChange={handleFileChange}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
