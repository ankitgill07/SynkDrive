import React, { useState } from "react";

function useGlobalProgress() {
  const [progress, setProgress] = useState([]);
  
  const updateProgress = (fileId, percent) => {
    setProgress((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, progress: percent } : file,
      ),
    );
  };

  return {
    progress,
    updateProgress,
    setProgress
  };
}

export default useGlobalProgress;
