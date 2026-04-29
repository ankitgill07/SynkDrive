function    ShareFilePreview({ file }) {
  const getFileExtension = (name) => {
    return name?.split(".").pop()?.toLowerCase() || "file";
  };

  const ext = getFileExtension(file.name);

  const renderPreview = () => {
    switch (true) {
          
      case ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext):
        return (
          <div className="flex items-center justify-center h-full w-full">
            <img
              src={file.url}
              alt={file.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );

      case ext === "pdf":
        return (
    <iframe
  src={`${file.url}#toolbar=0`}
  title={file.name}
  className="w-full h-full bg-transparent border-0"
/>
        );

      // Audio
      case ["mp3", "wav", "m4a", "aac", "flac"].includes(ext):
        return (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v9.28c-.47-.46-1.12-.75-1.84-.75-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V7h4V3h-5z" />
              </svg>
            </div>
            <audio controls className="w-full max-w-md">
              <source src={file.url} type={`audio/${ext}`} />
              Your browser does not support audio playback.
            </audio>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} Audio File
            </p>
          </div>
        );

      // Video
      case ["mp4", "mkv", "mov", "avi", "webm", "flv"].includes(ext):
        return (
          <div className="flex items-center justify-center h-full w-full">
            <video controls className="max-w-full max-h-full rounded-lg">
              <source src={file.url} type={`video/${ext}`} />
              Your browser does not support video playback.
            </video>
          </div>
        );

      // Documents (PDF, Word, etc.)
      case ["doc", "docx"].includes(ext):
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18H5v-2h9v2zm5-4H5V4h14v12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-blue-600 text-lg font-semibold">
              {ext === "pdf" ? "PDF Document" : "Word Document"}
            </p>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} • 12.4 MB
            </p>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 mt-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Open Document
            </a>
          </div>
        );

      // Spreadsheets
      case ["xls", "xlsx", "csv"].includes(ext):
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8-4h2V5h-2v2zm4 0h2V5h-2v2zm4 0h2V5h-2v2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-green-600 text-lg font-semibold">
              {ext === "csv" ? "CSV File" : "Excel Spreadsheet"}
            </p>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} • 12.4 MB
            </p>
          </div>
        );

      // Presentations
      case ["ppt", "pptx"].includes(ext):
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-5 18H5v-2h9v2zm5-4H5V4h14v12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-orange-600 text-lg font-semibold">
              PowerPoint Presentation
            </p>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} • 12.4 MB
            </p>
          </div>
        );

      // Code Files
      case [
        "js",
        "jsx",
        "ts",
        "tsx",
        "py",
        "html",
        "css",
        "json",
        "xml",
        "java",
        "cpp",
        "rb",
      ].includes(ext):
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.4 16.6L4.8 12l4.6-4.6L6.6 6l-6 6 6 6 2.8-2.4zm5.2 0l4.6-4.6-4.6-4.6 2.8-2.8 6 6-6 6-2.8-2.4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-amber-600 text-lg font-semibold">Code File</p>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} • 12.4 MB
            </p>
          </div>
        );

      // Archives
      case ["zip", "rar", "7z", "tar", "gz"].includes(ext):
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 5.23 11.08 5 12 5c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45c.67-.33 1.25-.77 1.72-1.31.85-.89 1.39-2.1 1.39-3.42 0-2.05-1.53-3.76-3.56-3.97z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-yellow-600 text-lg font-semibold">
              Archive File
            </p>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} • 12.4 MB
            </p>
          </div>
        );

      // Default/Unknown file types
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
              <svg
                className="w-16 h-16 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 text-center break-all max-w-2xl">
              {file.name}
            </h2>
            <p className="text-slate-600 text-lg font-semibold">File</p>
            <p className="text-slate-500 text-sm">
              {ext.toUpperCase()} • 12.4 MB
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderPreview()}
    </div>
  );
}


export default ShareFilePreview