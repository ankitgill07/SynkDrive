import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { ArrowUpFromLine, ChevronDown, FileUp, FolderUp } from "lucide-react";
import { FaDropbox } from "react-icons/fa6";
import { useFileProgress } from "@/contextApi/FileProgress";

export default function FadeMenu() {
  const { handleFileChange, open, handleClick, anchorEl, handleClose } =
    useFileProgress();

  return (
    <div>
      <button className="bg-[#d9d4cc3b] relative overflow-hidden hover:bg-[#e9e8e8] cursor-pointer px-3.5 py-1.5 flex items-center rounded-md">
        <ArrowUpFromLine size={18} />
        <span className="mx-1 font-bold text-sm">Upload</span>
        <input type="file" className=" absolute  left-0 cursor-pointer opacity-0" multiple onChange={handleFileChange} />
      </button>
      {/* <Menu
        id="fade-menu"
        slotProps={{
          list: {
            "aria-labelledby": "fade-button",
          },
        }}
        style={{ padding: "10px", marginTop: "6px" }}
        slots={{ transition: Fade }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem style={{ marginBottom: "3px" }}>
          <label className="flex items-center gap-2 cursor-pointer w-full">
            <FileUp className=" text-black " size={17} />
            <p className=" font-inter text-sm font-medium  ">File</p>
            <input type="file" hidden multiple onChange={handleFileChange} />
          </label>
        </MenuItem>
        <MenuItem disableRipple>
          <label className="flex items-center gap-2 cursor-pointer w-full">
            <FolderUp className=" text-black  " size={18} />
            <p className=" font-inter text-sm font-medium  ">Folder </p>
            <input
              type="file"
              hidden
              multiple
              webkitdirectory="true"
              directory="true"
              // onChange={handleFileChange}
            />
          </label>
        </MenuItem>

        <MenuItem disableRipple>
          <label className="flex items-center gap-2 cursor-pointer w-full mr-4.5 ">
            <FaDropbox className=" text-black " size={17} />
            <p className=" font-inter text-sm font-medium  ">
              Import from Dropbox
            </p>
            <input
              type="file"
              hidden
              multiple
              webkitdirectory="true"
              directory="true"
              onChange={handleFileChange}
            />
          </label>
        </MenuItem>
      </Menu> */}
    </div>
  );
}
