import { Router } from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, getMe);

export default router;
