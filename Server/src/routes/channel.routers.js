import { Router } from "express";
import { uploadMulter } from "../middlewares/Multer.middleware.js";
import { createChannel,authChannelByHandle,editChannelByHandle,getMyChannel,deleteChannelByHandle } from "../controllers/channel.controller.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isChannelOwner } from "../middlewares/isChannelOwner.middleware.js";
const router = Router();

router.route("/create").post(
    verifyJWT,
    uploadMulter.fields([
        { name: "logo", maxCount: 1 },
        { name: "banner", maxCount: 1 },
    ]),
    createChannel
);
router.route("/auth").get(verifyJWT,getMyChannel);
router.route("/:handle").get(authChannelByHandle);
router.route("/:handle/edit")
.patch(verifyJWT, isChannelOwner, uploadMulter
    .fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
]), editChannelByHandle);
router.route("/:handle/delete").get(
    verifyJWT,
    isChannelOwner,
    deleteChannelByHandle
);

export default router;