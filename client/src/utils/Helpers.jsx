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

export function SelectionCheckbox({ isSelected }) {
  return (
    <div
      className={`
    relative w-5 h-5 flex items-center justify-center
    rounded-[5px] cursor-pointer
    transition-all duration-200 ease-out
    ${
      !isSelected
        ? "bg-white border-[1.5px]  shadow-sm border-black hover:bg-blue-50/30"
        : "bg-[#0061FF] border-[1.5px] border-[#0061FF] shadow-[0_2px_8px_rgba(0,97,255,0.3)]"
    }

    /* Logic to show on folder hover or when selected */
    ${
      isSelected
        ? "opacity-100 scale-100"
        : "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100"
    }
  `}
    >
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

      <div
        className={`
    absolute -inset-1 rounded-2xl border-2 
    transition-opacity duration-200 pointer-events-none
    ${isSelected ? "opacity-0" : "opacity-0 group-focus-within:opacity-100"}
  `}
      />
    </div>
  );
}
