import Users from "../models/userModel.js";
import { sendOtpServService } from "../services/sendOptService.js";
import OTP from "../models/otpModel.js";
import { googleAuth } from "../services/googleAuthService.js";
import { ObjectId } from "mongodb";
import { setUserCookie } from "../utils/cookieUtil.js";
import {
  createSocailUser,
  createUser,
  logoutUserPreviewLoginDevice,
} from "../services/authService.js";
import { githubAuth } from "../services/githubAuthService.js";
import { loginValidate, registerValidate } from "../validate/authValidate.js";
import Folder from "../models/FolderModel.js ";
import { errorResponse, successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "http-status-codes";
import { UAParser } from "ua-parser-js";

export const userRegister = async (req, res, next) => {
  const { success, data, error } = registerValidate.safeParse(req.body);

  if (!success) {
   return res.status(403).json({ error: error.issues });
  }

  const { name, email, password, trems, otp } = data;

  const user = await Users.findOne({ email, isDisable: false });
  if (!user) {
    return errorResponse(
      res,
      StatusCodes.FORBIDDEN,
      "Your account is deactivated. Please contact support for reactivation.",
    );
  }

  const optRecord = await OTP.findOne({ email, otp }).lean();

  if (!optRecord) {
    return errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Invalid OTP or Exipred otp",
    );
  }

  await OTP.deleteOne();

  try {
    const userId = new ObjectId();
    const folderId = new ObjectId();

    await createUser({ userId, folderId, name, email, password, trems });
    return successResponse(res, StatusCodes.CREATED, "Account Created");
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { success, data, error } = loginValidate.safeParse(req.body);

  if (!success) {
    res.status(403).json({ error: error.issues });
  }

  const { email, password } = data;

  try {
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invaild Credentials" });
    } else if (user.isDisable) {
      return errorResponse(
        res,
        StatusCodes.FORBIDDEN,
        "Your account is deactivated. Please contact support for reactivation.",
      );
    }
    const verifyPassword = await user.comparePassword(password);

    if (!verifyPassword) {
      return res.status(401).json({ error: "Invaild Credentials" });
    }
    user.loginWithPassword = true;
    await user.save();
    const parser = new UAParser(req.headers["user-agent"]);
    await logoutUserPreviewLoginDevice({ userId: user._id });
    await setUserCookie(res, user._id, parser);
    res.status(201).json({ success: "Login Successfuly" });
  } catch (error) {
    next(error);
  }
};

export const userInfoData = async (req, res) => {
  const user = req.user;
  const rootFolder = await Folder.findById(user.rootFolderId);
  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    maxStorageLimite: user.maxStorageLimite,
    usedStorage: rootFolder.size,
    role: user.role,
    maxFileSize : user.maxFileSize,
    socialLogin: user.createdWith !== "email",
    socialProvider: user.createdWith === "email" ? null : user.createdWith,
    manualLogin: user.loginWithPassword,
  });
};

export const sendVerificationCode = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (user) {
      return res.status(401).json({ error: "Email  already exists" });
    }
    const resData = await sendOtpServService(email);
    res.status(201).json(resData);
  } catch (error) {
    next(error);
  }
};

export const loginWithgoogleAuth = async (req, res, next) => {
  const { code } = req.body;
  try {
    const { name, email, picture } = await googleAuth(code);
    const user = await Users.findOne({ email });
    const parser = new UAParser(req.headers["user-agent"]);
    if (user) {
      if (user.isDisable) {
        return errorResponse(
          res,
          StatusCodes.FORBIDDEN,
          "Your account is deactivated. Please contact support for reactivation.",
        );
      }
      await setUserCookie(res, user._id, parser);
      res.status(201).json({ success: "Login Successfuly" });
    } else {
      const userId = new ObjectId();
      const folderId = new ObjectId();
      await createSocailUser({
        userId,
        folderId,
        name,
        email,
        picture,
        createdWith: "google",
        loginWithPassword: false,
      });
      await logoutUserPreviewLoginDevice({ userId });
      await setUserCookie(res, userId, parser);
      res.status(201).json({ success: "Account Created" });
    }
  } catch (error) {
    next(error);
  }
};

export const redirectToAuthURL = async (req, res, next) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=Ov23lirRtNWXRJA0WsI5&scope=user:email`;
  res.redirect(redirectUrl);
};

export const loginWithgithubAuth = async (req, res) => {
  const { code } = req.query;
  try {
    const { name, email, picture } = await githubAuth(code);
    const user = await Users.findOne({ email, isDisable: false });
    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/error?message=Your account is deactivated. Please contact support for reactivation.`,
      );
    }
    if (user) {
      await setUserCookie(res, user._id);
    } else {
      const userId = new ObjectId();
      const folderId = new ObjectId();
      createSocailUser({
        userId,
        folderId,
        name,
        email,
        picture,
        createdWith: "github",
        isDisable: false,
        loginWithPassword: false,
      });
      const parser = new UAParser(req.headers["user-agent"]);
      await logoutUserPreviewLoginDevice({ userId: user._id });
      await setUserCookie(res, userId, parser);
    }
    res.redirect(process.env.FRONTEND_URL);
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};
