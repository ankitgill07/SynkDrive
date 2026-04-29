import Users from "../models/userModel.js";
import Folder from "../models/FolderModel.js ";
import mongoose from "mongoose";
import redisClient from "../db/redisDB.js";

export const createSocailUser = async ({
  userId,
  folderId,
  name,
  email,
  picture,
  createdWith,
  loginWithPassword,
}) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Folder.insertOne(
        {
          _id: folderId,
          name: `root-${email}`,
          parentFolderId: null,
          userId,
        },
        {
          session,
        },
      );

      await Users.insertOne(
        {
          _id: userId,
          name,
          email,
          picture,
          rootFolderId: folderId,
          trems: true,
          createdWith,
          loginWithPassword,
        },
        {
          session,
        },
      );
    });
  } catch (error) {
    throw error;
  } finally {
    session.endSession();
  }
};

export const createUser = async ({
  userId,
  folderId,
  name,
  email,
  password,
  trems,
  picture,
}) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Folder.insertOne(
        {
          _id: folderId,
          name: `root-${email}`,
          parentFolderId: null,
          userId,
        },
        {
          session,
        },
      );

      await Users.insertOne(
        {
          _id: userId,
          name,
          email,
          picture,
          password,
          rootFolderId: folderId,
          trems: trems,
          createdWith: "email",
          loginWithPassword: true,
        },
        {
          session,
        },
      );
    });
  } catch (error) {
    console.log(error);
  } finally {
    session.endSession();
  }
};

export const logoutUserPreviewLoginDevice = async ({ userId }) => {
  const allSessions = await redisClient.ft.search(
    "userIdx",
    `@userId:{${userId}}`,
  );
  if (allSessions.total >= 3) {
    await allSessions[0].deleteOne();
  }
};
