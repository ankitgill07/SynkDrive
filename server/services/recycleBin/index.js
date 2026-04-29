import File from "../../models/fileModel.js";
import { getFolderSize } from "../../utils/helperUtil.js";
import Folder from "../../models/folderModel.js ";
import { s3DeleteObjects, s3DeletePreSingedUrl } from "../file/s3Servies.js";
import { ObjectId } from "mongodb";

export const softDeleteFile = async (fileId, userId) => {
  try {
    const file = await File.findOne({ _id: fileId, userId });

    if (!file) throw new Error("File not found");
    await File.updateOne(
      { _id: fileId, userId },
      { $set: { isDeleted: true, deletedByParent: false } },
    );
    await getFolderSize(file.parentFolderId, -file.size, {
      skipStorageUsage: true,
    });
  } catch (error) {
    throw error;
  }
};

export const softDeleteFolder = async (folderId) => {
  try {
    const folder = await Folder.findById(folderId);

    await Folder.findByIdAndUpdate(folderId, {
      $set: {
        isDeleted: true,
        deletedByParent: false,
      },
    });

    async function deleteChildren(parentId) {
      await File.updateMany(
        { parentFolderId: parentId },
        {
          $set: {
            isDeleted: true,
            deletedByParent: true,
          },
        },
      );
      const subFolders = await Folder.find({
        parentFolderId: parentId,
      });

      for (const sub of subFolders) {
        await Folder.findByIdAndUpdate(sub._id, {
          $set: {
            isDeleted: true,
            deletedByParent: true,
          },
        });
        await deleteChildren(sub._id);
      }
    }
    await deleteChildren(folderId);
    getFolderSize(folderId, -folder.size, { skipStorageUsage: true });
    return;
  } catch (error) {
    throw error;
  }
};

export const folderDeleteParmanetly = async (id, userId) => {
  try {
    const folder = await Folder.findOne({
      _id: id,
      userId: userId,
      isDeleted: true,
    });

    if (!folder) throw new Error("Folder not found");

    async function getFolderItems(folderId) {
      let files = await File.find({
        isDeleted: true,
        parentFolderId: folderId,
      }).lean();

      let folders = await Folder.find(
        { isDeleted: true, parentFolderId: folderId },
        { projection: { _id: 1 } },
      ).lean();

      for (const { _id } of folders) {
        const { files: childFiles, folders: childFolders } =
          await getFolderItems(new ObjectId(_id));
        files = [...files, ...childFiles];
        folders = [...folders, ...childFolders];
      }
      return { files, folders };
    }

    const { files, folders } = await getFolderItems(id);

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    console.log("folder:", folder);
    console.log("files found:", files.length);
    console.log("totalSize to subtract:", totalSize);
    console.log("starting getFolderSize from id:", id);

    const Keys = files.map(({ _id, extension }) => ({
      Key: `${_id}${extension}`,
    }));
    await getFolderSize(id, -totalSize, { skipFolderTree: true });
    await s3DeleteObjects({ Keys });
    await File.deleteMany({ _id: { $in: files.map(({ _id }) => _id) } });
    await Folder.deleteMany({
      _id: { $in: [...folders.map(({ _id }) => _id), id] },
    });
  } catch (error) {
    throw error;
  }
};


export const filesDeletParmanetly = async (fileId, userId) => {
  try {
    const file = await File.findOne({ _id: fileId, userId });

    if (!file) throw new Error("File not found");

    const Keys = [{ Key: `${file._id}${file.extension}` }];

    await s3DeleteObjects({ Keys });
    await File.findByIdAndDelete(fileId);

    await getFolderSize(file.parentFolderId, -file.size, {
      skipFolderTree: true,
    });
  } catch (error) {
    throw error;
  }
};

export const restoreFiles = async (fileId, userId) => {
  const file = await File.findOne({ _id: fileId, userId });

  if (!file) throw new Error("File not found");
  await File.updateOne({ _id: fileId, userId }, { $set: { isDeleted: false } });
  await getFolderSize(file.parentFolderId, file.size, {
    skipStorageUsage: true,
  });
};

export const restoreFolderOrFile = async (id) => {
  try {
    async function backUpFolder(folderId) {
      let totalSize = 0;
      await Folder.findByIdAndUpdate(folderId, {
        $set: { isDeleted: false, deletedByParent: false },
      });
      const files = await File.find({ parentFolderId: folderId });

      await File.updateMany(
        {
          parentFolderId: folderId,
        },
        { $set: { isDeleted: false, deletedByParent: false } },
      );
      for (const file of files) {
        totalSize += file.size;
      }
      const subFolder = await Folder.find({ parentFolderId: folderId });

      for (const sub of subFolder) {
        await Folder.findByIdAndUpdate(sub._id, {
          $set: {
            isDeleted: false,
            deletedByParent: false,
          },
        });
        const subSize = await backUpFolder(sub._id);
        totalSize += subSize;
      }
      return totalSize;
    }
    const totalNestedSize = await backUpFolder(id);
    await getFolderSize(id, totalNestedSize, { skipStorageUsage: true });
  } catch (error) {
    throw error;
  }
};
