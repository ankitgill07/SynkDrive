import { google } from "googleapis";
import { getAuthenticatedClient } from "../../utils/googleOAuth2.js";
import Folder from "../../models/folderModel.js";
import File from "../../models/fileModel.js";
import fs from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import { s3UploadPresignedUrl } from "./s3Servies.js";
import axios from "axios";
import { getFolderSize } from "../../utils/helperUtil.js";

const EXPORT_FORMATS = {
  "application/vnd.google-apps.document": {
    mime: "application/pdf",
    ext: ".pdf",
  },
  "application/vnd.google-apps.spreadsheet": { mime: "text/csv", ext: ".csv" },
  "application/vnd.google-apps.presentation": {
    mime: "application/pdf",
    ext: ".pdf",
  },
  "application/vnd.google-apps.drawing": { mime: "image/png", ext: ".png" },
};

const sanitize = (name) => name.replace(/[^a-z0-9.\-_\s]/gi, "_").trim();

export const maxFileSizeLimit = async ({ user }) => {
  const rootFolder = await Folder.findById(user.rootFolderId);
  const remainingSpace = user.maxStorageLimite - rootFolder.size;

  
};

export const importGoogleDrive = async (
  fileId,
  name,
  mimeType,
  size,
  accessToken,
  rootFolderId,
  userId,
) => {
  const oauth2Client = getAuthenticatedClient({ token: accessToken });
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  let extension = path.extname(name) || "";
  let finalName = sanitize(name);
  const exportMime = EXPORT_FORMATS[mimeType];
  let response;
  try {
    if (exportMime) {
      response = await drive.files.export(
        { fileId, mimeType: exportMime },
        { responseType: "arraybuffer" },
      );
      extension = EXPORT_EXTENSIONS[mimeType];
      finalName = sanitize(path.basename(name, path.extname(name))) + extension;
    } else {
      response = await drive.files.get(
        { fileId, alt: "media" },
        { responseType: "arraybuffer" },
      );
    }

    const folder = await Folder.findOne({
      name: "Google Drive",
      parentFolderId: rootFolderId,
      userId,
    });

    let targetFolderId;
    if (!folder) {
      const newId = new ObjectId();
      await Folder.create({
        _id: newId,
        userId,
        name: "Google Drive",
        path: [newId],
        parentFolderId: rootFolderId,
      });
      targetFolderId = newId;
    } else {
      targetFolderId = folder._id;
    }

    const file = await File.create({
      name: finalName,
      parentFolderId: targetFolderId,
      size,
      extension,
      userId,
    });
    let fullFileName = `${file._id}${extension}`;
    const type = exportMime || mimeType;
    const uploadUrl = await s3UploadPresignedUrl(fullFileName, type);

    await axios.put(uploadUrl, response.data, {
      headers: {
        "Content-Type": type,
        "Content-Length": response.data.byteLength,
      },
    });
    await getFolderSize(file.parentFolderId, file.size);
  } catch (error) {
    throw error;
  }
};
