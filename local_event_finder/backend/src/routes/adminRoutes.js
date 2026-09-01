import { Router } from "express";
import { DashboardController, UserAdminController } from "../controllers/ContentController.js";
import { NotificationAdminController } from "../controllers/NotificationController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate, requireRole("admin"));

router.get("/stats", DashboardController.stats);
router.get("/users", DashboardController.users);
router.get("/subscribers", DashboardController.subscribers);
router.get("/content", DashboardController.content);

router.get("/notifications", NotificationAdminController.list);
router.post("/notifications", NotificationAdminController.send);

router.put("/users/:id/role", UserAdminController.updateRole);
router.put("/users/:id", UserAdminController.update);
router.delete("/users/:id", UserAdminController.destroy);

export default router;