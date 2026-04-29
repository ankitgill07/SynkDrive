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
import { FaFolder } from "react-icons/fa";
import { formatSize, formatTimestamp } from "@/utils/Helpers";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 18,
    padding: theme.spacing(0.5),
    background: "#fafafa",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2.5),
  },
  "& .MuiDialogTitle-root": {
    padding: theme.spacing(2.5),
  },
}));

export default function CustomizedDialogs({ open, setOpen, item }) {
  const handleClose = () => setOpen(false);

  const size = formatSize(item?.size);
  const createdTime = formatTimestamp(item.createdAt);
  const modifiedTime = formatTimestamp(item?.updatedAt);
  const type =
    item?.type === "folder" ? item.type : item.extension.split(".")[1];
  const info = [
    { label: "Type", value: type },
    { label: "Size", value: size },
    { label: "Created", value: createdTime },
    { label: "Modified", value: modifiedTime },
  ];

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="info-dialog-title"
    >
      <DialogTitle
        id="info-dialog-title"
        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Info size={20} className="text-blue-500" />
        <Typography variant="h6" className="font-semibold tracking-wide">
          Information
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
        <div className="flex flex-col items-center mb-6 w-90 mx-auto">
          <FaFolder size={110} className="text-blue-500 opacity-90" />
          <Typography
            variant="subtitle1"
            className="font-medium mt-2 text-center"
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
