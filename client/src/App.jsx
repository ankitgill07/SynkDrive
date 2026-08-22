import { RouterProvider, useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import router from "./routers/Router";
import RootLayout from "./layout/RootLayout";
import React from "react";
import { FileProgressProvider } from "./contextApi/FileProgress";
import SnackbarProvider from "./contextApi/SnackbarContext";
import { FilePreviewProvider } from "./contextApi/FilePreviewContext";

function App() {
  return (
    <React.StrictMode>
      <RootLayout />
      <SnackbarProvider>
        <FileProgressProvider>
          <FilePreviewProvider>
            <RouterProvider router={router} />
          </FilePreviewProvider>
        </FileProgressProvider>
      </SnackbarProvider>
    </React.StrictMode>
  );
}

export default App;
