import { Router } from "express";
import { SavedController } from "../controllers/SavedController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/", authenticate, SavedController.list);
router.get("/ids", authenticate, SavedController.ids);
router.post("/:id", authenticate, SavedController.save);
router.delete("/:id", authenticate, SavedController.unsave);

export default router;