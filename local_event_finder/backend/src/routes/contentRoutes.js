import { Router } from "express";
import { ContentController } from "../controllers/ContentController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

router.post("/newsletter", ContentController.subscribe);
router.get("/:key", ContentController.get);
router.put("/:key", authenticate, requireRole("admin"), ContentController.update);

export default router;