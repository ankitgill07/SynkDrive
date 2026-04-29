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