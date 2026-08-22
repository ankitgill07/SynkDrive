import {
  Archive,
  Code2,
  Download,
  File,
  FileAudio,
  FileSpreadsheet,
  FileText,
  FileVideo,
  ImageIcon,
  Presentation,
} from "lucide-react";
import { formatSize } from "./Helpers";

const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const audioExtensions = ["mp3", "wav", "m4a", "aac", "flac", "ogg"];
const videoExtensions = ["mp4", "mkv", "mov", "avi", "webm", "flv"];
const documentExtensions = ["doc", "docx", "pdf", "txt", "md", "rtf"];
const spreadsheetExtensions = ["xls", "xlsx", "csv"];
const presentationExtensions = ["ppt", "pptx"];
const codeExtensions = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "py",
  "html",
  "css",
  "json",
  "xml",
  "java",
  "cpp",
  "rb",
];
const archiveExtensions = ["zip", "rar", "7z", "tar", "gz"];

function getFileExtension(file) {
  const source = file?.extension || file?.name || "";
  return source.replace(/^\./, "").split(".").pop()?.toLowerCase() || "file";
}

function getFileType(ext) {
  if (imageExtensions.includes(ext)) return "Image";
  if (ext === "pdf") return "PDF document";
  if (audioExtensions.includes(ext)) return "Audio file";
  if (videoExtensions.includes(ext)) return "Video file";
  if (["doc", "docx", "rtf"].includes(ext)) return "Document";
  if (["txt", "md"].includes(ext)) return "Text document";
  if (spreadsheetExtensions.includes(ext)) return ext === "csv" ? "CSV file" : "Spreadsheet";
  if (presentationExtensions.includes(ext)) return "Presentation";
  if (codeExtensions.includes(ext)) return "Code file";
  if (archiveExtensions.includes(ext)) return "Archive";
  return "File";
}

function getFallbackMeta(ext) {
  if (spreadsheetExtensions.includes(ext)) {
    return { Icon: FileSpreadsheet, color: "text-emerald-600", bg: "bg-emerald-50" };
  }
  if (presentationExtensions.includes(ext)) {
    return { Icon: Presentation, color: "text-orange-600", bg: "bg-orange-50" };
  }
  if (codeExtensions.includes(ext)) {
    return { Icon: Code2, color: "text-amber-600", bg: "bg-amber-50" };
  }
  if (archiveExtensions.includes(ext)) {
    return { Icon: Archive, color: "text-yellow-700", bg: "bg-yellow-50" };
  }
  if (audioExtensions.includes(ext)) {
    return { Icon: FileAudio, color: "text-pink-600", bg: "bg-pink-50" };
  }
  if (videoExtensions.includes(ext)) {
    return { Icon: FileVideo, color: "text-violet-600", bg: "bg-violet-50" };
  }
  if (imageExtensions.includes(ext)) {
    return { Icon: ImageIcon, color: "text-rose-600", bg: "bg-rose-50" };
  }
  if (documentExtensions.includes(ext)) {
    return { Icon: FileText, color: "text-blue-600", bg: "bg-blue-50" };
  }
  return { Icon: File, color: "text-slate-600", bg: "bg-slate-50" };
}

function FallbackPreview({ file, ext }) {
  const { Icon, color, bg } = getFallbackMeta(ext);
  const fileType = getFileType(ext);
  const size = Number.isFinite(file?.size) ? formatSize(file.size) : null;

  return (
    <div className="flex h-full w-full items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className={`flex h-24 w-24 items-center justify-center rounded-2xl ${bg}`}>
          <Icon className={`h-12 w-12 ${color}`} />
        </div>
        <div className="min-w-0 space-y-2">
          <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
            {file?.name || "Shared file"}
          </h2>
          <p className="text-sm font-medium text-slate-500">
            {[ext.toUpperCase(), fileType, size].filter(Boolean).join(" | ")}
          </p>
        </div>
        {file?.url && (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Open file
          </a>
        )}
      </div>
    </div>
  );
}

function ShareFilePreview({ file }) {
  const ext = getFileExtension(file);

  if (!file?.url) {
    return <FallbackPreview file={file} ext={ext} />;
  }

  if (imageExtensions.includes(ext)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <img
          src={file.url}
          alt={file.name || "Shared file preview"}
          className="max-h-full max-w-full rounded-md object-contain"
        />
      </div>
    );
  }

  if (ext === "pdf" || ["txt", "md"].includes(ext)) {
    return (
      <iframe
        src={ext === "pdf" ? `${file.url}#toolbar=0` : file.url}
        title={file.name || "Shared file preview"}
        className="h-full min-h-[65vh] w-full rounded-md border border-slate-200 bg-white"
      />
    );
  }

  if (audioExtensions.includes(ext)) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <div className="w-full max-w-xl space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <FallbackPreview file={file} ext={ext} />
          <audio controls className="w-full">
            <source src={file.url} type={`audio/${ext}`} />
            Your browser does not support audio playback.
          </audio>
        </div>
      </div>
    );
  }

  if (videoExtensions.includes(ext)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <video controls className="max-h-full max-w-full rounded-md bg-black">
          <source src={file.url} type={`video/${ext}`} />
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return <FallbackPreview file={file} ext={ext} />;
}

export { getFileExtension, getFileType };
export default ShareFilePreview;
