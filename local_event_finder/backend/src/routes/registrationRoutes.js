import { Router } from "express";
import { RegistrationController } from "../controllers/RegistrationController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);
router.get("/", RegistrationController.list);
router.post("/khalti/confirm", RegistrationController.confirm);

export default router;