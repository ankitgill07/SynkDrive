import cron from "node-cron";
import Users from "../models/userModel.js";
import Folder from "../models/folderModel.js";
import File from "../models/fileModel.js";
import { folderDeleteParmanetly, filesDeletParmanetly } from "../services/recycleBin/index.js";

export const cleanExpiredRecycleBinItemsCron = () => {
  try {
    // Run daily at midnight: "0 0 * * *"
    cron.schedule("0 0 * * *", async () => {
      console.log("[Recycle Bin Cron] Starting cleanup job...");
      const now = new Date();
      
      try {
        const users = await Users.find({}, { _id: 1, restoreFileDays: 1 });

        for (const user of users) {
          const days = user.restoreFileDays || 30;
          const thresholdDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

          // Find root expired folders
          const expiredFolders = await Folder.find({
            userId: user._id,
            isDeleted: true,
            deletedByParent: false,
            updatedAt: { $lte: thresholdDate }
          });

          for (const folder of expiredFolders) {
            console.log(`[Recycle Bin Cron] Permanently deleting expired folder: ${folder.name} (${folder._id}) for user ${user._id}`);
            try {
              await folderDeleteParmanetly(folder._id, user._id);
            } catch (err) {
              console.error(`[Recycle Bin Cron] Failed to permanently delete folder ${folder._id}:`, err.message);
            }
          }

          // Find root expired files
          const expiredFiles = await File.find({
            userId: user._id,
            isDeleted: true,
            deletedByParent: false,
            updatedAt: { $lte: thresholdDate }
          });

          for (const file of expiredFiles) {
            console.log(`[Recycle Bin Cron] Permanently deleting expired file: ${file.name} (${file._id}) for user ${user._id}`);
            try {
              await filesDeletParmanetly(file._id, user._id);
            } catch (err) {
              console.error(`[Recycle Bin Cron] Failed to permanently delete file ${file._id}:`, err.message);
            }
          }
        }
      } catch (error) {
        console.error("[Recycle Bin Cron] Error executing cleanup:", error.message);
      }
      console.log("[Recycle Bin Cron] Finished cleanup job.");
    });
  } catch (error) {
    console.error("Recycle Bin cron initialization failed:", error.message);
  }
};
