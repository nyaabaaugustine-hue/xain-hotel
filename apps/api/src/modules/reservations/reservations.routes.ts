import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as ctrl from "./reservations.controller";

const router: Router = Router() as Router;
router.use(authenticate);

router.get("/", ctrl.getReservations);
router.get("/stats", ctrl.getStats);
router.get("/:id", ctrl.getReservation);
router.post("/", ctrl.createReservation);
router.put("/:id", ctrl.updateReservation);
router.put("/:id/checkin", ctrl.checkIn);
router.put("/:id/checkout", ctrl.checkOut);
router.put("/:id/cancel", ctrl.cancelReservation);

export default router;
