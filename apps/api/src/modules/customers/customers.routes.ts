import { Router } from "express";
import { authenticate } from "../../middleware/auth";
import * as ctrl from "./customers.controller";

const router: Router = Router() as Router;
router.use(authenticate);
router.get("/", ctrl.getCustomers);
router.get("/:id", ctrl.getCustomer);
router.post("/", ctrl.createCustomer);
router.put("/:id", ctrl.updateCustomer);
router.delete("/:id", ctrl.deleteCustomer);

export default router;
