import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Info, X } from "lucide-react";
import {
  FaFolder,
  FaFile,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileAudio,
  FaFileVideo,
  FaFileImage,
} from "react-icons/fa";
import { formatSize, formatTimestamp } from "@/utils/Helpers";
import { getPreviewUrlApi } from "@/api/fileApi";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
    padding: theme.spacing(0.5),
    background: "#fafafa",
    width: "calc(100% - 32px)",
    margin: theme.spacing(2),
    maxWidth: "400px",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2.5),
  },
  "& .MuiDialogTitle-root": {
    padding: theme.spacing(2.5),
  },
}));

export default function CustomizedDialogs({ open, setOpen, item }) {
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [loadingPreview, setLoadingPreview] = React.useState(false);

  const handleClose = () => setOpen(false);

  const size = item ? formatSize(item.size) : "";
  const createdTime = item ? formatTimestamp(item.createdAt) : "";
  const modifiedTime = item ? formatTimestamp(item.updatedAt) : "";
  const extension = item?.extension ? item.extension.toLowerCase() : "";
  const type =
    item?.type === "folder" ? "folder" : (extension ? extension.replace(".", "") : "file");

  const isImage = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"].includes(item?.extension ? item.extension.toLowerCase() : "");

  React.useEffect(() => {
    if (open && item && item.type !== "folder" && isImage) {
      setLoadingPreview(true);
      setPreviewUrl(null);
      getPreviewUrlApi(item._id)
        .then((res) => {
          if (res?.previewUrl) {
            setPreviewUrl(res.previewUrl);
          }
        })
        .catch((err) => {
          console.error("Failed to load file preview:", err);
        })
        .finally(() => {
          setLoadingPreview(false);
        });
    } else {
      setPreviewUrl(null);
      setLoadingPreview(false);
    }
  }, [open, item, isImage]);

  const info = [
    { label: "Type", value: type },
    { label: "Size", value: size },
    { label: "Created", value: createdTime },
    { label: "Modified", value: modifiedTime },
  ];

  const renderPreview = () => {
    if (item?.type === "folder") {
      return <FaFolder size={110} className="text-blue-500 opacity-90" />;
    }

    if (isImage) {
      if (previewUrl) {
        return (
          <img
            src={previewUrl}
            alt={item?.name}
            className="w-full max-h-48 object-contain rounded-lg border border-border bg-white"
          />
        );
      }
      if (loadingPreview) {
        return (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse border border-border">
            <span className="text-xs text-muted-foreground font-medium">Loading preview...</span>
          </div>
        );
      }
    }

    const ext = extension.replace(".", "");
    switch (ext) {
      case "pdf":
        return <FaFilePdf size={110} className="text-red-500 opacity-90" />;
      case "doc":
      case "docx":
        return <FaFileWord size={110} className="text-blue-600 opacity-90" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel size={110} className="text-green-600 opacity-90" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint size={110} className="text-orange-600 opacity-90" />;
      case "zip":
      case "rar":
      case "7z":
      case "tar":
      case "gz":
        return <FaFileArchive size={110} className="text-yellow-600 opacity-90" />;
      case "mp3":
      case "wav":
      case "ogg":
      case "m4a":
        return <FaFileAudio size={110} className="text-purple-500 opacity-90" />;
      case "mp4":
      case "mov":
      case "avi":
      case "mkv":
        return <FaFileVideo size={110} className="text-indigo-500 opacity-90" />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "webp":
      case "svg":
        return <FaFileImage size={110} className="text-teal-500 opacity-90" />;
      default:
        return <FaFile size={110} className="text-gray-500 opacity-90" />;
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="info-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        id="info-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Info size={20} className="text-blue-500" />
        <Typography variant="h6" className="font-semibold tracking-wide">
          {item?.type === "folder" ? "Folder Information" : "File Information"}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ marginLeft: "auto", color: "gray" }}
          aria-label="close"
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "#e5e5e5" }}>
        <div className="flex flex-col items-center mb-6 w-full mx-auto">
          {renderPreview()}
          <Typography
            variant="subtitle1"
            className="font-medium mt-2 text-center break-all w-full px-2"
          >
            {item?.name}
          </Typography>
        </div>

        <ul className="space-y-4">
          {info.map((row, idx) => (
            <li
              key={idx}
              className="flex justify-between capitalize border-b pb-2 text-sm font-medium"
            >
              <span className="text-gray-500">{row.label}</span>
              <span className="text-gray-800">{row.value}</span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </StyledDialog>
  );
}
