import { User } from "../models/user.model.js";
import asyncHandler from "../utiles/asyncHandler.js";
import jwt from "jsonwebtoken";

const attachUser = asyncHandler(async (req, res, next) => {
    const initialToken = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
    if (!initialToken) {
        req.user = null;
        return next();
    }
    try {
        const decodedToken = jwt.verify(initialToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            req.user = null;
            return next();
        }   
        // This populate method will help us to get the channel details along with user details.What we do in my all 3 api routes i.e register,login and authcheck i have populate the channel details. 
        const user = await User.findById(decodedToken._id)
        .select('-password -refreshToken')
        .populate({ path: 'channel', select: '_id name handle logo' });
        if (!user) {
            req.user = null;
            return next();
        }
        req.user = user;
        next();
    } catch (error) {
        req.user = null;
        next();
    }
});

export { attachUser };