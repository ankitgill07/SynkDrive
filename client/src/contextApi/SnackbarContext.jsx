import React, { createContext, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { X } from "lucide-react";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export default function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const showSnackbar = (message) => {
    setSnackbar({ open: true, message });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };


  const action = (
    <React.Fragment>
      <Button
        size="small"
        onClick={handleClose}
        sx={{
          color: "#d3e3fd", // text color
          fontWeight: 300,
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <X size={20} />
      </IconButton>
    </React.Fragment>
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={snackbar.message}
        action={action}
      />
    </SnackbarContext.Provider>
  );
}
