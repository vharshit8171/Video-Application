import { Router } from "express";
import { uploadMulter } from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { isChannelOwner } from "../middlewares/isChannelOwner.middleware.js";
import { getAllVideos, publishAVideo, getOwnerVideos,getVideoById, getVideoBySearch, getRecommendedVideos, updateVideo, deleteAVideo, togglePublishStatus } from "../controllers/video.controller.js"
const router = Router()

router.route('/getAllVideos').get(verifyJWT,getAllVideos);
router.route('/:handle/publishVideo').post(
    verifyJWT,
    isChannelOwner,
    uploadMulter.fields([
        { name: 'videoClip', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },]),
    publishAVideo);
router.route("/channel/:handle/videos").get(getOwnerVideos);    
router.route('/getVideo/:id').get(verifyJWT,getVideoById);
router.route('/search').get(getVideoBySearch);
router.route('/recommended/:videoId').get(verifyJWT,getRecommendedVideos);
router.route('/:handle/updateVideo/:id').patch(
    verifyJWT,
    isChannelOwner,
    uploadMulter.single('thumbnail'),
    updateVideo);
router.route('/:handle/deleteVideo/:id').get(
    verifyJWT,
    isChannelOwner,
    deleteAVideo);
router.route('/toggle/:id').patch(verifyJWT,togglePublishStatus);

export default router