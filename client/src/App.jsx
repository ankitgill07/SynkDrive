import { RouterProvider, useParams } from "react-router-dom";
import Header from "./components/Header/Header";
import router from "./routers/Router";
import RootLayout from "./layout/RootLayout";
import React from "react";
import { FileProgressProvider } from "./contextApi/FileProgress";
import SnackbarProvider from "./contextApi/SnackbarContext";

function App() {
  return (
    <React.StrictMode>
      <RootLayout />
      <SnackbarProvider>
        <FileProgressProvider>
          <RouterProvider router={router} />
        </FileProgressProvider>
      </SnackbarProvider>
    </React.StrictMode>
  );
}

export default App;
