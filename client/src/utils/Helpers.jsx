import React from "react";
import { IoMdImage } from "react-icons/io";
import { FaHeadphones } from "react-icons/fa";
import { IoDocumentTextSharp, IoFilm, IoMusicalNotes } from "react-icons/io5";

import { IoVideocam, IoCodeSlash } from "react-icons/io5";
import { BiSolidFilePdf } from "react-icons/bi";
import {
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
} from "react-icons/fa";
import { SiJson, SiTypescript } from "react-icons/si";
import { Field, FieldGroup } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const renderFilePreview = ({ file, size = 20 }) => {
  let extension = "";

  if (typeof file === "string") {
    extension = file.split(".").pop().toLowerCase();
  } else if (file?.extension) {
    extension = file.extension.split(".").pop().toLowerCase();
  }

  const iconClass = "flex-shrink-0";

  const extensionMap = {
    // 🖼 Images
    jpg: <IoMdImage size={size} className={`text-red-500 ${iconClass}`} />,
    jpeg: <IoMdImage size={size} className={`text-red-500 ${iconClass}`} />,
    png: <IoMdImage size={size} className={`text-red-500 ${iconClass}`} />,
    webp: <IoMdImage size={size} className={`text-red-500 ${iconClass}`} />,
    gif: <IoMdImage size={size} className={`text-red-500 ${iconClass}`} />,
    svg: <IoMdImage size={size} className={`text-red-500 ${iconClass}`} />,

    // 📄 Documents
    pdf: <BiSolidFilePdf size={size} className={`text-red-600 ${iconClass}`} />,
    doc: <FaFileWord size={size} className={`text-blue-600 ${iconClass}`} />,
    docx: <FaFileWord size={size} className={`text-blue-600 ${iconClass}`} />,
    xls: <FaFileExcel size={size} className={`text-green-600 ${iconClass}`} />,
    xlsx: <FaFileExcel size={size} className={`text-green-600 ${iconClass}`} />,
    ppt: (
      <FaFilePowerpoint
        size={size}
        className={`text-orange-500 ${iconClass}`}
      />
    ),
    pptx: (
      <FaFilePowerpoint
        size={size}
        className={`text-orange-500 ${iconClass}`}
      />
    ),
    txt: (
      <IoDocumentTextSharp
        size={size}
        className={`text-blue-400 ${iconClass}`}
      />
    ),
    md: (
      <IoDocumentTextSharp
        size={size}
        className={`text-blue-400 ${iconClass}`}
      />
    ),

    // 🎵 Audio (Better Icon)
    mp3: (
      <IoMusicalNotes size={size} className={`text-pink-500 ${iconClass}`} />
    ),
    wav: (
      <IoMusicalNotes size={size} className={`text-pink-500 ${iconClass}`} />
    ),
    ogg: (
      <IoMusicalNotes size={size} className={`text-pink-500 ${iconClass}`} />
    ),

    // 🎬 Video (Better Icon)
    mp4: <IoFilm size={size} className={`text-purple-500 ${iconClass}`} />,
    webm: <IoFilm size={size} className={`text-purple-500 ${iconClass}`} />,
    mov: <IoFilm size={size} className={`text-purple-500 ${iconClass}`} />,

    // 💻 Code
    js: <IoCodeSlash size={size} className={`text-yellow-500 ${iconClass}`} />,
    ts: <SiTypescript size={size} className={`text-blue-500 ${iconClass}`} />,
    jsx: <IoCodeSlash size={size} className={`text-blue-500 ${iconClass}`} />,
    tsx: <SiTypescript size={size} className={`text-blue-500 ${iconClass}`} />,
    json: <SiJson size={size} className={`text-yellow-600 ${iconClass}`} />,
    html: (
      <IoCodeSlash size={size} className={`text-orange-600 ${iconClass}`} />
    ),
    css: <IoCodeSlash size={size} className={`text-blue-400 ${iconClass}`} />,

    // 🗜 Archive
    zip: (
      <FaFileArchive size={size} className={`text-yellow-700 ${iconClass}`} />
    ),
    rar: (
      <FaFileArchive size={size} className={`text-yellow-700 ${iconClass}`} />
    ),
    "7z": (
      <FaFileArchive size={size} className={`text-yellow-700 ${iconClass}`} />
    ),
  };

  return (
    extensionMap[extension] || (
      <IoDocumentTextSharp
        size={size}
        className={`text-gray-400 ${iconClass}`}
      />
    )
  );
};

export function formatSize(bytes) {
  if (bytes === 0 || isNaN(bytes)) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  let index = Math.floor(Math.log(bytes) / Math.log(1024));
  index = Math.min(index, units.length - 1);

  const value = (bytes / Math.pow(1024, index)).toFixed(2);

  return `${value} ${units[index]}`;
}

export function formatTimestamp(timestamp, timeZone = "UTC") {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour12: true,
  });
}

export function SelectionCheckbox({ isSelected, isSelectionMode }) {
  const showBackground = isSelected === true || isSelected === "indeterminate";

  return (
    <div
      className={`
    relative w-5 h-5 flex items-center justify-center
    rounded-[5px] cursor-pointer
    transition-all duration-200 ease-out
    ${
      !showBackground
        ? "bg-white border-[1.5px]  shadow-sm border-black hover:bg-blue-50/30"
        : "bg-[#0061FF] border-[1.5px] border-[#0061FF] shadow-[0_2px_8px_rgba(0,97,255,0.3)]"
    }

    /* Logic to show on folder hover or when selected */
    ${
      showBackground || isSelectionMode
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
    }
  `}
    >
      {isSelected === "indeterminate" ? (
        <svg
          viewBox="0 0 24 24"
          className="w-3.5 h-3.5 text-white"
        >
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className={`
      w-3.5 h-3.5 text-white transition-all duration-300 transform
      ${
        isSelected
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-50 translate-y-1"
      }
    `}
        >
          <path
            d="M5 13l4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <div
        className={`
    absolute -inset-1 rounded-2xl border-2 
    transition-opacity duration-200 pointer-events-none
    ${showBackground ? "opacity-0" : "opacity-0 group-focus-within:opacity-100"}
  `}
      />
    </div>
  );
}

export function selectRole() {
return (
    <FieldGroup className="w-full max-w-xs ">
    <Field>
      <Select defaultValue="view">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" className=" overflow-y-auto ">
          <SelectGroup>
            <SelectItem value="view">View</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  </FieldGroup>
)
}

export const getMimeType = (fileName) => {
  if (!fileName) return "application/octet-stream";
  const parts = fileName.split(".");
  if (parts.length <= 1) return "application/octet-stream";
  const ext = parts.pop().toLowerCase();
  
  const mimeTypes = {
    // Images
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    bmp: "image/bmp",
    tiff: "image/tiff",
    
    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    flac: "audio/flac",

    // Video
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    flv: "video/x-flv",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    csv: "text/csv",
    rtf: "application/rtf",
    md: "text/markdown",

    // Archives
    zip: "application/zip",
    rar: "application/vnd.rar",
    tar: "application/x-tar",
    gz: "application/gzip",
    "7z": "application/x-7z-compressed",

    // Executables/Binaries
    exe: "application/x-msdownload",
    msi: "application/x-msdownload",
    apk: "application/vnd.android.package-archive",
    dmg: "application/x-apple-diskimage",
    iso: "application/x-iso9660-image"
  };

  return mimeTypes[ext] || "application/octet-stream";
};

