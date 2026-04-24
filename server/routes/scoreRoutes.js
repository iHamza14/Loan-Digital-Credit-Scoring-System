import { Router } from "express";
import { getMyScore, getHistory, rescore, getExplanation } from "../controllers/scoreController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// all score routes require authentication
router.use(authenticate);

router.get("/my-score", getMyScore);
router.get("/history", getHistory);
router.post("/rescore", rescore);
router.get("/explain", getExplanation);

export default router;
