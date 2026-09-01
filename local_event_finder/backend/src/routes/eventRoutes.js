import { Router } from "express";
import { EventController } from "../controllers/EventController.js";
import { RegistrationController } from "../controllers/RegistrationController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", EventController.index);
router.get("/locations", EventController.locations);
router.get("/near", EventController.near);
router.get("/featured", EventController.featured);
router.get("/trending", EventController.trending);
router.get("/live", EventController.live);
router.get("/:slug/register-status", authenticate, RegistrationController.status);
router.post("/:slug/register", authenticate, RegistrationController.register);
router.delete("/:slug/register", authenticate, RegistrationController.unregister);
router.get("/:slug", EventController.show);

router.post("/", authenticate, requireRole("admin"), EventController.store);
router.put("/:id", authenticate, requireRole("admin"), EventController.update);
router.delete("/:id", authenticate, requireRole("admin"), EventController.destroy);

export default router;