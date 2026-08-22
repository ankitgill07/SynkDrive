import Folder from "../models/folderModel.js ";

const ROOT_STORAGE_ID = null; // or whatever marks the top-level storage node

export async function getFolderSize(parentId, fileSize, options = {}) {
  const { skipStorageUsage = false, skipFolderTree = false } = options;

  while (parentId) {
    const folder = await Folder.findById(parentId);
    if (!folder) break;

    const isStorageRoot = !folder.parentFolderId;

    if (skipFolderTree && !isStorageRoot) {
      parentId = folder.parentFolderId;
      continue;
    }

    if (skipStorageUsage && isStorageRoot) {
      // Skip root folder (total storage usage)
      break;
    }

    folder.size += fileSize;
    await folder.save();
    parentId = folder.parentFolderId;
  }
}

export const getMimeType = (fileName) => {
  if (!fileName) return "application/octet-stream";
  const parts = fileName.split(".");
  if (parts.length <= 1) return "application/octet-stream";
  const ext = parts.pop().toLowerCase();
  
  const mimeTypes = {
    // Images
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    bmp: "image/bmp",
    tiff: "image/tiff",
    
    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    aac: "audio/aac",
    flac: "audio/flac",

    // Video
    mp4: "video/mp4",
    webm: "video/webm",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    flv: "video/x-flv",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    csv: "text/csv",
    rtf: "application/rtf",
    md: "text/markdown",

    // Archives
    zip: "application/zip",
    rar: "application/vnd.rar",
    tar: "application/x-tar",
    gz: "application/gzip",
    "7z": "application/x-7z-compressed",

    // Executables/Binaries
    exe: "application/x-msdownload",
    msi: "application/x-msdownload",
    apk: "application/vnd.android.package-archive",
    dmg: "application/x-apple-diskimage",
    iso: "application/x-iso9660-image"
  };

  return mimeTypes[ext] || "application/octet-stream";
};