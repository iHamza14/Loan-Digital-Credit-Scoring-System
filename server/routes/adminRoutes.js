import { Router } from "express";
import { getDashboard, getApplications, updateStatus, getAnalytics } from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middlewares/auth.js";

const router = Router();

// all admin routes require authentication + admin role
router.use(authenticate);
router.use(requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/applications", getApplications);
router.put("/applications/:id/status", updateStatus);
router.get("/analytics", getAnalytics);

export default router;
