import { Router } from 'express';
import { userRegister,userLogin,refreshAccessToken,userLogout,addToWatchHistory,getWatchHistory,updatePassword,updateCredentials,deleteUser } from '../controllers/user.controller.js'
import { uploadMulter } from '../middlewares/Multer.middleware.js';
import {authLimiter} from '../middlewares/RateLimiter.middleware.js'
import { verifyJWT } from '../middlewares/Auth.middleware.js';
const router = Router();

// Here we use the patch request which is used to update some feilds in our db.Secondly here we have to remind that the uploadfeilds is basically provided by our multer middleware. 

router.route('/register').post(
    authLimiter,
    uploadMulter.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'photo', maxCount: 1 }]),
    userRegister)
router.route('/login').post(authLimiter,userLogin) 
router.route('/refresh-token').post(refreshAccessToken)
router.route('/logout').post(verifyJWT,userLogout)  
router.route('/history/:videoId').post(verifyJWT,addToWatchHistory)
router.route('/history').get(verifyJWT,getWatchHistory)
router.route('/updatePassword').patch(verifyJWT,updatePassword)
router.route('/updateCredentials').patch(verifyJWT,
uploadMulter.single("avatar"),    
updateCredentials)
router.route('/delete-account').delete(verifyJWT,deleteUser)

export default router;