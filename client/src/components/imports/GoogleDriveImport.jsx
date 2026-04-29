import { importFormGoogeDiveApi } from "@/api/fileApi";
import { userAuth } from "@/contextApi/AuthContext";
import useGlobalProgress from "@/hooks/useGlobalProgress";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useDrivePicker from "react-google-drive-picker";
import { toast } from "sonner";

function GoogleDriveImport({ Allfolder }) {
  const [openPicker, authResponse] = useDrivePicker();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const tokenRef = useRef(null);

  useEffect(() => {
    if (authResponse?.access_token) {
      tokenRef.current = authResponse.access_token;
    }
  }, [authResponse]);

  const importFiles = useCallback(
    async (docs, token) => {
      if (!token) {
        toast.error("❌ No access token found. Please try again.");
        return;
      }
      try {
        setLoading(true);
        setProgress(0);
        const payload = docs.map((file) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: file.sizeBytes,
          accessToken: token,
        }));
        const result = await importFormGoogeDiveApi(payload, setProgress);
        if (result.success) {
          Allfolder();
          toast.success(result?.data);
          setStatus(`✅ Imported ${docs?.length} file(s) successfully.`);
        } else {
          toast.error(result?.message);
          setStatus("❌ Import failed: " + result?.message);
        }
      } catch (err) {
        setStatus("❌ Import failed: " + err.message);
        toast.error("❌ Import failed: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [Allfolder, progress],
  );
  console.log(progress);

  const handleOpenPicker = () => {
    openPicker({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      developerKey: import.meta.env.VITE_APP_GOOGLE_API_KEY,
      viewId: "DOCS",
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === "picked") {
          const token = tokenRef.current ?? authResponse?.access_token;
          importFiles(data.docs, token);
        }
      },
    });
  };

  return (
    <div>
      <button
        onClick={handleOpenPicker}
        className="bg-[#d9d4cc3b] hover:bg-[#e9e8e8] cursor-pointer px-2.5 py-1.5 flex items-center rounded-md"
      >
        <img
          className="w-5"
          src="https://png.pngtree.com/png-vector/20230817/ourmid/pngtree-google-internet-icon-vector-png-image_9183287.png"
          alt=""
        />
        <span className="font-plusjakartaSans ml-1.5 font-bold text-sm">
          Import from Google Drive
        </span>
      </button>
    </div>
  );
}

export default GoogleDriveImport;
