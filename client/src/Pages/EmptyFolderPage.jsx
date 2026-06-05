import { Plus, Upload } from "lucide-react";

export default function EmptyFolderPage() {
  return (
 <div>
  <div className="flex flex-col items-center justify-center pt-20 gap-4 text-[#bbb]">
    <div className="text-[52px]">📂</div>
    <div className="text-[16px] font-semibold text-[#444]">
      This folder is empty
    </div>

    <div className="text-[13px] text-slate-400 text-center">
      Drag files from your computer into the folder zone, or upload using the button above.
    </div>

    <div className="flex gap-2.5">
      <button
        className="btn flex items-center gap-1.5 px-[18px] py-[9px] bg-[#f5f6f8] border-[1.5px] border-[#e3e8ef] rounded-[10px] text-[13px] font-semibold text-[#333]"
        onClick={() => setNewFolderMode(true)}
      >
        <Plus />
        New Folder
      </button>

      <button
        className="btn flex items-center gap-1.5 px-[18px] py-[9px] bg-[#1a73e8] border-0 rounded-[10px] text-[13px] font-semibold text-white"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload />
        Upload Files
      </button>
    </div>
  </div>
 </div>
  );
}
