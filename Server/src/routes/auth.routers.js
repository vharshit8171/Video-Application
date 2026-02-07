import { Router } from "express";
import { checkAuth } from "../controllers/auth.controller.js";
import { attachUser } from "../middlewares/AttachUser.middleware.js";

const router = Router();

router.route("/me").get(attachUser, checkAuth);

export default router;