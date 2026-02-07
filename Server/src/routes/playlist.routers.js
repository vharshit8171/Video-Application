import {Router} from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { createPlaylist,getUserPlaylist,addVideoToPlaylist, getPlaylistById, removeVideoFromPlaylist, deletePlaylist } from "../controllers/playlist.controller.js";
const router = Router();

router.use(verifyJWT);
router.route('/user/my').get(getUserPlaylist);
router.route('/create-playlist/:userId').post(createPlaylist);
router.route('/:videoId/add-video').patch(addVideoToPlaylist);
router.route('/:playlistId/remove-video/:videoId').patch(removeVideoFromPlaylist);
router.route('/getplaylist/:playlistId').get(getPlaylistById);
router.route('/delete-playlist/:playlistId').delete(deletePlaylist);

export default router;