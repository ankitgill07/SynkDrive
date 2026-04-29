import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contextApi/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FileProgressProvider } from "./contextApi/FileProgress";
import { useParams } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/Store";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
