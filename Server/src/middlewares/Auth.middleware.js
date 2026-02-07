import { User } from "../models/user.model.js";
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import asyncHandler from "../utiles/asyncHandler.js";
import jwt from "jsonwebtoken";

// This middleware is used to verify the token of the user when user makes any request to change his credentials or password or anything else.So directly we have implemented the authentication feature.

const verifyJWT = asyncHandler(async(req,res,next) => {
    // In some cases user can also uses the smart phone in that case the token will be available inside the authorization header so we do so.After we succcessfully find that user in our db than we add an object in to our request object so it will we accessiable into our main function.
    // console.log("Cookies in verifyJWT Middleware",req.cookies);
    const initialToken = req.cookies?.accessToken || req.headers.authorization?.replace('Bearer ', '');
    // console.log("Initial Token",initialToken);
    // console.log('Secret',process.env.ACCESS_TOKEN_SECRET);
    // console.log(initialToken)
    if(!initialToken){
        return res
        .status(401)
        .json(new ApiResponse(401,null,'Access Token is missing'));
    }
    try {
        // Gives the payload we store in our token as an output.
        const decodedToken = jwt.verify(initialToken,process.env.ACCESS_TOKEN_SECRET);
        // console.log("Decoded Token",decodedToken)
        if(!decodedToken){
            throw new ApiError(401,'Token is incorrect');
        }
        const logoutUser = await User.findById(decodedToken._id)
        .select('-password -refreshToken');
        // console.log(logoutUser);
        if(!logoutUser){
            throw new ApiError(401,'Invalid access Token');
        }
        req.user = logoutUser;
        // console.log("working");
        next();
    } catch (error) {
        throw new ApiError(401,'Invalid token');
    }
})
export {verifyJWT}
// First we make a user registered or login both what we are doing is we set the refresh token into our db and also set it as a cookie in user browser now user makes a request like for changing passwords or credentials or anything else we uses this middlware, the refreshtoken comes in cookie we verify that and throught which extract the _id and search the user in our db so throught this only valid user can make changes. 