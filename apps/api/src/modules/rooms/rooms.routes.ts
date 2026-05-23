import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as ctrl from "./rooms.controller";

const router = Router();
router.use(authenticate);

router.get("/", ctrl.getRooms);
router.get("/available", ctrl.getAvailableRooms);
router.get("/:id", ctrl.getRoom);
router.post("/", ctrl.createRoom);
router.put("/:id", ctrl.updateRoom);
router.delete("/:id", ctrl.deleteRoom);
router.get("/types/all", ctrl.getRoomTypes);
router.post("/types", ctrl.createRoomType);

export default router;
