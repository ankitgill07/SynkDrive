import express from 'express';
import { checkAuth, requireRole } from '../middlewares/authMiddleware.js';
import {
  getDashboardMetrics,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  bulkDeleteUsers,
  logoutAdminUser,
  bulkLogoutUsers,
  getStorageStats,
  getSystemLogs
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard-stats', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), getDashboardMetrics);
router.get('/users', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), getAdminUsers);
router.post('/users/bulk-delete', checkAuth, requireRole(['Admin','admin']), bulkDeleteUsers);
router.post('/users/bulk-logout', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), bulkLogoutUsers);
router.patch('/users/:id', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), updateAdminUser);
router.delete('/users/:id', checkAuth, requireRole(['Admin','admin']), deleteAdminUser);
router.post('/users/:id/logout', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), logoutAdminUser);
router.get('/storage-stats', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), getStorageStats);
router.get('/logs', checkAuth, requireRole(['Admin','admin','Manager','manager','Manger']), getSystemLogs);

export default router;
