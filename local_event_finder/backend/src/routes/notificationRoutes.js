import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);
router.get("/", NotificationController.index);
router.post("/read-all", NotificationController.markAllRead);
router.post("/:id/read", NotificationController.markRead);

export default router;