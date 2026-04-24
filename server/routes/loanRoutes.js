import { Router } from "express";
import { apply, getMyLoans, getLoanById } from "../controllers/loanController.js";
import { authenticate } from "../middlewares/auth.js";
import { validateLoanApplication } from "../middlewares/validate.js";

const router = Router();

// all loan routes require authentication
router.use(authenticate);

router.post("/apply", validateLoanApplication, apply);
router.get("/my-loans", getMyLoans);
router.get("/:id", getLoanById);

export default router;
