import { importFormGoogeDiveApi } from "@/api/fileApi";
import { userAuth } from "@/contextApi/AuthContext";
import { useFileProgress } from "@/contextApi/FileProgress";
import { useCallback, useEffect, useRef } from "react";
import useDrivePicker from "react-google-drive-picker";
import { toast } from "sonner";

function GoogleDriveImport({ Allfolder }) {
  const [openPicker, authResponse] = useDrivePicker();
  const { addProgressFiles, updateProgress } = useFileProgress();
  const { user } = userAuth();
  const tokenRef = useRef(null);

  useEffect(() => {
    if (authResponse?.access_token) {
      tokenRef.current = authResponse.access_token;
    }
  }, [authResponse]);

  const importFiles = useCallback(
    async (docs, token) => {
      if (!token) {
        toast.error("No access token found. Please try again.");
        return;
      }

      try {
        const payload = docs.map((file) => ({
          id: file.id,
          importId: `drive-${file.id}`,
          name: file.name,
          mimeType: file.mimeType,
          size: file.sizeBytes,
          accessToken: token,
        }));

        addProgressFiles(
          payload.map((file) => ({
            id: file.importId,
            name: file.name,
            size: Number(file.size) || 0,
            progress: 0,
            type: file.mimeType,
          })),
        );

        const result = await importFormGoogeDiveApi(payload);
        if (result?.success) {
          payload.forEach((file) => updateProgress(file.importId, 100));
          Allfolder();
          toast.success(result?.data);
        } else {
          toast.error(result?.message || "Import failed");
        }
      } catch (err) {
        toast.error(`Import failed: ${err.message}`);
      }
    },
    [Allfolder, addProgressFiles, updateProgress],
  );

  const handleOpenPicker = () => {
    if (!user?.id && !user?._id) {
      toast.error("Please log in again before importing files.");
      return;
    }

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
        <span className="hidden md:inline font-plusjakartaSans ml-1.5 font-bold text-sm">
          Import from Google Drive
        </span>
      </button>
    </div>
  );
}

export default GoogleDriveImport;
