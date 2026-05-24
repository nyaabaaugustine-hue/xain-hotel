import { Router } from "express";
import * as ctrl from "./public.controller";

const router = Router();

// No authenticate middleware — these are open public endpoints
router.get("/rooms", ctrl.listRooms);
router.get("/rooms/available", ctrl.availableRooms);
router.post("/booking", ctrl.createPublicBooking);

export default router;
