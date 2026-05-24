import { Router } from "express";
import { login, logout, refreshToken, forgotPassword, resetPassword, me } from "./auth.controller";
import { authenticate } from "../../middleware/auth";

const router: Router = Router() as Router;

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", authenticate, me);

export default router;
