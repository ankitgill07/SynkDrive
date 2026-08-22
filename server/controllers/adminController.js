import { StatusCodes } from 'http-status-codes';
import Users from '../models/userModel.js';
import File from '../models/fileModel.js';
import Folder from '../models/folderModel.js';
import { AuditLog } from '../models/auditLogModel.js';
import redisClient from '../db/redisDB.js';
import { s3DeleteObjects } from '../services/file/s3Servies.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { cloudfrontSignedUrl } from '../services/file/cloudFront.js';
import path from 'path';

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const totalUsers = await Users.countDocuments();
    const disabledUsers = await Users.countDocuments({ isDisable: true });

    let activeSessions = 0;
    try {
      const activeSessionsResult = await redisClient.ft.search('userIdx', '*', { LIMIT: { from: 0, size: 0 } });
      activeSessions = activeSessionsResult.total;
    } catch (err) {
      // Redis index may not exist yet
      activeSessions = 0;
    }

    const fileStorage = await File.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    let totalUsed = fileStorage.length > 0 ? fileStorage[0].totalSize : 0;
    if (!totalUsed) {
      const rootFoldersSize = await Folder.aggregate([
        { $match: { parentFolderId: null } },
        { $group: { _id: null, totalSize: { $sum: '$size' } } }
      ]);
      totalUsed = rootFoldersSize.length > 0 ? rootFoldersSize[0].totalSize : 0;
    }

    const usersStorageLimit = await Users.aggregate([
      { $group: { _id: null, totalAllocated: { $sum: '$maxStorageLimite' } } }
    ]);
    const totalAllocated = usersStorageLimit.length > 0 ? usersStorageLimit[0].totalAllocated : 0;

    // User registration growth for last 7 months
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
    const registrations = await Users.aggregate([
      { $match: { createdAt: { $gte: sevenMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const registrationGrowth = registrations.map(r => ({
      month: r._id,
      count: r.count
    }));

    return res.status(200).json({
      totalUsers,
      disabledUsers,
      activeSessions,
      totalUsed,
      totalAllocated,
      registrationGrowth,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { search, role, status, page = 1, limit = 10, sortField = 'name', sortDirection = 'asc' } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role && role !== 'all') {
      query.role = { $regex: new RegExp('^' + role + '$', 'i') };
    }
    if (status && status !== 'all') {
      if (status === 'active') query.isDisable = false;
      if (status === 'disabled') query.isDisable = true;
    }

    const sortObj = {};
    sortObj[sortField] = sortDirection === 'asc' ? 1 : -1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await Users.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password')
      .lean();

    const total = await Users.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const enhancedUsers = await Promise.all(users.map(async (user) => {
      let storageUsed = 0;
      try {
        const fileUsage = await File.aggregate([
          { $match: { userId: user._id, isDeleted: false } },
          { $group: { _id: null, totalSize: { $sum: '$size' } } }
        ]);
        if (fileUsage && fileUsage.length > 0) {
          storageUsed = fileUsage[0].totalSize;
        } else {
          const rootFolder = await Folder.findById(user.rootFolderId);
          storageUsed = rootFolder ? rootFolder.size : 0;
        }
      } catch (e) {
        storageUsed = 0;
      }

      let isOnline = false;
      try {
        const sessionsResult = await redisClient.ft.search('userIdx', `@userId:{${user._id}}`);
        isOnline = sessionsResult.total > 0;
      } catch (e) {
        isOnline = false;
      }

      let pictureUrl = user.picture;
      if (pictureUrl && pictureUrl.startsWith("profile-pics/")) {
        try {
          pictureUrl = await cloudfrontSignedUrl({
            key: pictureUrl,
            fileName: `profile${path.extname(pictureUrl)}`,
          });
        } catch (err) {}
      }

      return {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: pictureUrl,
        isDisable: user.isDisable,
        maxStorageLimite: user.maxStorageLimite,
        storageUsed,
        status: user.isDisable ? 'disabled' : 'active',
        isOnline,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    }));

    return res.status(200).json({
      users: enhancedUsers,
      total,
      totalCount: total,
      page: parseInt(page),
      totalPages
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, isDisable, maxStorageLimite } = req.body;

    const loggedInUserRole = req.user.role.toLowerCase();

    const targetUser = await Users.findById(id);
    if (!targetUser) {
      return errorResponse(res, StatusCodes.NOT_FOUND, 'User not found');
    }

    // Manager restrictions
    if (loggedInUserRole === 'manager' || loggedInUserRole === 'manger') {
      if (role && ['admin', 'Admin'].includes(role)) {
        return errorResponse(res, StatusCodes.FORBIDDEN, 'Managers cannot grant Admin roles');
      }

      const targetUserRole = targetUser.role.toLowerCase();
      if (['admin'].includes(targetUserRole)) {
        return errorResponse(res, StatusCodes.FORBIDDEN, 'Managers cannot edit Admin users');
      }
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (role !== undefined) updateFields.role = role;
    if (isDisable !== undefined) updateFields.isDisable = isDisable;
    if (maxStorageLimite !== undefined) updateFields.maxStorageLimite = maxStorageLimite;

    const updatedUser = await Users.findByIdAndUpdate(id, updateFields, { new: true }).select('-password');

    await AuditLog.create({
      action: 'User updated',
      details: `User ${updatedUser.email} was updated by ${req.user.name}`,
      performedBy: req.user._id,
      targetUser: updatedUser._id,
      type: 'info'
    });

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const loggedInUserRole = req.user.role.toLowerCase();

    if (!['admin'].includes(loggedInUserRole)) {
      return errorResponse(res, StatusCodes.FORBIDDEN, 'Only Admins can delete users');
    }

    if (req.user._id.toString() === id) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, 'You cannot delete yourself');
    }

    const targetUser = await Users.findById(id);
    if (!targetUser) {
      return errorResponse(res, StatusCodes.NOT_FOUND, 'User not found');
    }

    // Get all files to delete from S3
    const files = await File.find({ userId: id });
    const Keys = files
      .filter(f => f._id && f.extension)
      .map(file => ({ Key: `${file._id}${file.extension}` }));

    if (Keys.length > 0) {
      for (let i = 0; i < Keys.length; i += 1000) {
        const chunk = Keys.slice(i, i + 1000);
        try {
          await s3DeleteObjects({ Keys: chunk });
        } catch (err) {
          console.error('Error deleting S3 objects:', err);
        }
      }
    }

    // Delete all folders and files from MongoDB
    await Folder.deleteMany({ userId: id });
    await File.deleteMany({ userId: id });

    // Clean up email shares & link shares
    try {
      const EmailShareModule = await import('../models/emailShareModal.js').catch(() => null);
      if (EmailShareModule?.default) {
        await EmailShareModule.default.deleteMany({ $or: [{ userId: id }, { sharedWith: id }] });
      }
    } catch (err) {}

    try {
      const LinkShareModule = await import('../models/linkShareModel.js').catch(() => null);
      if (LinkShareModule?.default) {
        await LinkShareModule.default.deleteMany({ userId: id });
      }
    } catch (err) {}

    try {
      const SubscriptionModule = await import('../models/subscriptionModal.js').catch(() => null);
      if (SubscriptionModule?.default) {
        await SubscriptionModule.default.deleteMany({ userId: id });
      }
    } catch (err) {}

    // Revoke all Redis sessions
    let sessionsCleaned = false;
    try {
      const sessions = await redisClient.ft.search('userIdx', `@userId:{${id}}`);
      if (sessions && sessions.documents && sessions.documents.length > 0) {
        for (const session of sessions.documents) {
          await redisClient.del(session.id);
        }
        sessionsCleaned = true;
      }
    } catch (err) {
      console.warn('ft.search failed during delete, using SCAN fallback');
    }

    // SCAN fallback
    if (!sessionsCleaned) {
      try {
        let cursor = 0;
        do {
          const result = await redisClient.scan(cursor, { MATCH: 'session:*', COUNT: 100 });
          cursor = result.cursor;
          for (const key of result.keys) {
            try {
              const sessionData = await redisClient.json.get(key);
              if (sessionData && String(sessionData.userId) === String(id)) {
                await redisClient.del(key);
              }
            } catch (e) {}
          }
        } while (cursor !== 0);
      } catch (scanErr) {}
    }

    // Delete the user
    await Users.findByIdAndDelete(id);

    // Audit log
    await AuditLog.create({
      action: 'User deleted',
      details: `User ${targetUser.email} (${targetUser.name}) was permanently deleted by ${req.user.name}`,
      performedBy: req.user._id,
      targetUser: targetUser._id,
      type: 'error'
    });

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const loggedInUserRole = req.user.role.toLowerCase();

    if (!['admin'].includes(loggedInUserRole)) {
      return errorResponse(res, StatusCodes.FORBIDDEN, 'Only Admins can delete users');
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, 'userIds must be a non-empty array');
    }

    let deletedCount = 0;
    for (const id of userIds) {
      if (req.user._id.toString() === id) continue;

      const targetUser = await Users.findById(id);
      if (!targetUser) continue;

      const files = await File.find({ userId: id });
      const Keys = files
        .filter(f => f._id && f.extension)
        .map(file => ({ Key: `${file._id}${file.extension}` }));

      if (Keys.length > 0) {
        try { await s3DeleteObjects({ Keys }); } catch (err) {}
      }

      await Folder.deleteMany({ userId: id });
      await File.deleteMany({ userId: id });

      try {
        const EmailShareModule = await import('../models/emailShareModal.js');
        const EmailShare = EmailShareModule.default;
        if (EmailShare) await EmailShare.deleteMany({ $or: [{ userId: id }, { sharedWith: id }] });
      } catch (err) {}

      try {
        const sessions = await redisClient.ft.search('userIdx', `@userId:{${id}}`);
        if (sessions && sessions.documents) {
          for (const session of sessions.documents) {
            await redisClient.del(session.id);
          }
        }
      } catch (err) {}

      await Users.findByIdAndDelete(id);

      await AuditLog.create({
        action: 'User deleted',
        details: `User ${targetUser.email} was deleted in bulk by ${req.user.name}`,
        performedBy: req.user._id,
        targetUser: targetUser._id,
        type: 'error'
      });

      deletedCount++;
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deletedCount} users`,
      count: deletedCount
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdminUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const targetUser = await Users.findById(id);
    if (!targetUser) {
      return errorResponse(res, StatusCodes.NOT_FOUND, 'User not found');
    }

    let revokedCount = 0;

    // Method 1: Try ft.search first
    try {
      const sessions = await redisClient.ft.search('userIdx', `@userId:{${id}}`);
      if (sessions && sessions.documents && sessions.documents.length > 0) {
        for (const session of sessions.documents) {
          await redisClient.del(session.id);
          revokedCount++;
        }
      }
    } catch (err) {
      console.warn('ft.search failed for logout, will use SCAN fallback:', err.message);
    }

    // Method 2: SCAN fallback - scan all session:* keys and check userId
    if (revokedCount === 0) {
      try {
        let cursor = 0;
        do {
          const result = await redisClient.scan(cursor, { MATCH: 'session:*', COUNT: 100 });
          cursor = result.cursor;
          for (const key of result.keys) {
            try {
              const sessionData = await redisClient.json.get(key);
              if (sessionData && String(sessionData.userId) === String(id)) {
                await redisClient.del(key);
                revokedCount++;
              }
            } catch (e) {
              // key might not be JSON, skip
            }
          }
        } while (cursor !== 0);
      } catch (scanErr) {
        console.error('SCAN fallback also failed:', scanErr.message);
      }
    }

    await AuditLog.create({
      action: 'Session revoked',
      details: `${revokedCount} session(s) revoked for ${targetUser.email} by ${req.user.name}`,
      performedBy: req.user._id,
      targetUser: id,
      type: 'warning'
    });

    return res.status(200).json({
      success: true,
      message: `User logged out successfully (${revokedCount} sessions revoked)`
    });
  } catch (error) {
    next(error);
  }
};

export const bulkLogoutUsers = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return errorResponse(res, StatusCodes.BAD_REQUEST, 'userIds must be a non-empty array');
    }

    let totalRevoked = 0;
    for (const id of userIds) {
      let userRevoked = 0;

      // Method 1: ft.search
      try {
        const sessions = await redisClient.ft.search('userIdx', `@userId:{${id}}`);
        if (sessions && sessions.documents && sessions.documents.length > 0) {
          for (const session of sessions.documents) {
            await redisClient.del(session.id);
            userRevoked++;
          }
        }
      } catch (err) {}

      // Method 2: SCAN fallback
      if (userRevoked === 0) {
        try {
          let cursor = 0;
          do {
            const result = await redisClient.scan(cursor, { MATCH: 'session:*', COUNT: 100 });
            cursor = result.cursor;
            for (const key of result.keys) {
              try {
                const sessionData = await redisClient.json.get(key);
                if (sessionData && String(sessionData.userId) === String(id)) {
                  await redisClient.del(key);
                  userRevoked++;
                }
              } catch (e) {}
            }
          } while (cursor !== 0);
        } catch (scanErr) {}
      }

      totalRevoked += userRevoked;
    }

    await AuditLog.create({
      action: 'Session revoked',
      details: `Bulk logout: ${totalRevoked} session(s) revoked for ${userIds.length} users by ${req.user.name}`,
      performedBy: req.user._id,
      type: 'warning'
    });

    return res.status(200).json({
      success: true,
      message: `${totalRevoked} sessions revoked for ${userIds.length} users`
    });
  } catch (error) {
    next(error);
  }
};

export const getStorageStats = async (req, res, next) => {
  try {
    // Aggregate files by extension to categorize
    const files = await File.aggregate([
      {
        $group: {
          _id: { $toLower: '$extension' },
          totalSize: { $sum: '$size' },
          count: { $sum: 1 }
        }
      }
    ]);

    const categories = {
      Images: { size: 0, count: 0 },
      Documents: { size: 0, count: 0 },
      Videos: { size: 0, count: 0 },
      Audio: { size: 0, count: 0 },
      Others: { size: 0, count: 0 }
    };

    const exts = {
      Images: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.ico'],
      Documents: ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.xls', '.csv', '.ppt', '.pptx'],
      Videos: ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'],
      Audio: ['.mp3', '.wav', '.ogg', '.aac', '.flac']
    };

    files.forEach(file => {
      const ext = file._id; // extension already has the dot from the model
      let matched = false;
      for (const [cat, extList] of Object.entries(exts)) {
        if (extList.includes(ext)) {
          categories[cat].size += file.totalSize;
          categories[cat].count += file.count;
          matched = true;
          break;
        }
      }
      if (!matched) {
        categories.Others.size += file.totalSize;
        categories.Others.count += file.count;
      }
    });

    const categoryArray = Object.entries(categories).map(([name, data]) => ({
      name,
      size: data.size,
      count: data.count,
      percentage: 0 // will be calculated below
    }));

    const totalFileSize = categoryArray.reduce((sum, cat) => sum + cat.size, 0);
    categoryArray.forEach(cat => {
      cat.percentage = totalFileSize > 0 ? Math.round((cat.size / totalFileSize) * 100) : 0;
    });

    // Top 5 users by storage
    const topUsersQuery = await Users.aggregate([
      {
        $lookup: {
          from: 'folders',
          let: { rootId: '$rootFolderId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$rootId'] } } }
          ],
          as: 'rootFolder'
        }
      },
      { $unwind: { path: '$rootFolder', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: 1,
          email: 1,
          picture: 1,
          storageUsed: { $ifNull: ['$rootFolder.size', 0] },
          maxStorageLimite: 1
        }
      },
      { $sort: { storageUsed: -1 } },
      { $limit: 5 }
    ]);

    for (const u of topUsersQuery) {
      if (u.picture && u.picture.startsWith("profile-pics/")) {
        try {
          u.picture = await cloudfrontSignedUrl({
            key: u.picture,
            fileName: `profile${path.extname(u.picture)}`,
          });
        } catch (err) {}
      }
    }

    // Total used and allocated
    const rootFoldersSize = await Folder.aggregate([
      { $match: { parentFolderId: null } },
      { $group: { _id: null, totalSize: { $sum: '$size' } } }
    ]);
    const totalUsed = rootFoldersSize.length > 0 ? rootFoldersSize[0].totalSize : 0;

    const usersStorageLimit = await Users.aggregate([
      { $group: { _id: null, totalAllocated: { $sum: '$maxStorageLimite' } } }
    ]);
    const totalAllocated = usersStorageLimit.length > 0 ? usersStorageLimit[0].totalAllocated : 0;

    return res.status(200).json({
      categories: categoryArray,
      topUsers: topUsersQuery,
      totalUsed,
      totalAllocated
    });
  } catch (error) {
    next(error);
  }
};

export const getSystemLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('performedBy', 'name email picture')
      .populate('targetUser', 'name email picture');

    for (const log of logs) {
      if (log.performedBy && log.performedBy.picture && log.performedBy.picture.startsWith("profile-pics/")) {
        try {
          log.performedBy.picture = await cloudfrontSignedUrl({
            key: log.performedBy.picture,
            fileName: `profile${path.extname(log.performedBy.picture)}`,
          });
        } catch (err) {}
      }
      if (log.targetUser && log.targetUser.picture && log.targetUser.picture.startsWith("profile-pics/")) {
        try {
          log.targetUser.picture = await cloudfrontSignedUrl({
            key: log.targetUser.picture,
            fileName: `profile${path.extname(log.targetUser.picture)}`,
          });
        } catch (err) {}
      }
    }

    const total = await AuditLog.countDocuments();
    const totalPages = Math.ceil(total / parseInt(limit));

    return res.status(200).json({
      logs,
      total,
      page: parseInt(page),
      totalPages
    });
  } catch (error) {
    next(error);
  }
};
