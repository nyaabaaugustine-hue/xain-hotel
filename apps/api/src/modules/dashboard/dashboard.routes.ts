import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import { getDashboard } from "./dashboard.controller";

const router: Router = Router() as Router;
router.get("/", authenticate, getDashboard);

export default router;
