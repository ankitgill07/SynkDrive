import React, { useEffect, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { IoDocumentTextSharp } from "react-icons/io5";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useFileProgress } from "@/contextApi/FileProgress";
import { renderFilePreview } from "@/utils/Helpers";
import { userAuth } from "@/contextApi/AuthContext";

function FileUploadProgress({ allItems }) {
  const { progress } = useFileProgress();
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(true);
  const { checkAuthorization } = userAuth();

  useEffect(() => {
    if (!progress || progress.length === 0) return;

    const allDone = progress.every((u) => u.progress >= 100);
    if (allDone) {
      allItems();
      checkAuthorization();
    }
  }, [progress, checkAuthorization]);


  
  if (!visible || !progress || progress.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className="w-80 bg-[#1a1918] text-white rounded-md p-3 shadow-lg border border-[#262626]">
        <div className="flex justify-between items-center mb-3">
          <p className="font-inter font-medium">progress ({progress.length})</p>

          <div className="flex items-center space-x-2">
            <button
              className="p-1 rounded-sm hover:bg-[#303030]"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronDown
                className={`transition-transform ${
                  collapsed ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              className="p-1 rounded-sm hover:bg-[#303030]"
              onClick={() => setVisible(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {!collapsed && (
          <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
            {progress.map((file) => {
              const pct =
                typeof file.progress === "number"
                  ? Math.min(Math.max(file.progress, 0), 100)
                  : 0;
              const files = file?.name;
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between bg-[#222] p-3 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    {renderFilePreview({ file: files })}
                    <div className="flex flex-col">
                      <span className="text-sm line-clamp-1 font-medium">
                        {file.name || "Untitled File"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {pct === 100 ? "Completed" : `Uploading...`}
                      </span>
                    </div>
                  </div>

                  {pct === 100 ? (
                    <div className=" bg-green-500 p-0.5 rounded-full">
                      {" "}
                      <Check size={15} />
                    </div>
                  ) : (
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={pct}
                        size={40}
                        thickness={4}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: "absolute",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="caption" sx={{ color: "#c7c7c7" }}>
                          {`${pct}%`}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUploadProgress;
