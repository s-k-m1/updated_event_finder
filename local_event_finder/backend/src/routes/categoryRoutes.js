import { Router } from "express";
import { CategoryController } from "../controllers/EventController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", CategoryController.index);

router.post("/", authenticate, requireRole("admin"), CategoryController.store);
router.put("/:id", authenticate, requireRole("admin"), CategoryController.update);
router.delete("/:id", authenticate, requireRole("admin"), CategoryController.destroy);

export default router;