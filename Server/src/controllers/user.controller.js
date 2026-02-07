import asyncHandler from '../utiles/asyncHandler.js'
import { ApiResponse } from '../utiles/ApiResponse.js'
import { ApiError } from '../utiles/ApiError.js'
import { User } from '../models/user.model.js'
import { Video } from "../models/video.model.js";
import { Channel } from "../models/channel.model.js";
import { deleteFromCloudinary, UploadOnCloudinary } from '../utiles/Cloudinary.js'
import jwt from 'jsonwebtoken'
// {
//     "username" : "Harshit verma",
//     "email": "harshitv@8171gmail.com",
//     "password" : "secret",
//     "location" : "Aligarh",
//     "avatar" : "random22",
//     "contact_number" : "223388779",
//     "photo": "random2"
// }

const genrateAccessAndRefreshTokens = async (userId) => {
    // The most important point here to be remember that we have not passed the whole user object here although we already searched that user throught username or email and agian make a db query beacuse when user login than we simply have the full user object as it sends it credentials but after some time when there is an need for refrsh our access token throught the refresh token than we doesnt have the whole user object we only have the _id which is present in the payload part of the refresh token. Hence it is neccessary that we uses the user._id instead of whole object.
    try {
        const user = await User.findById(userId);
        let accessToken = user.genrateAccessToken();
        let refreshToken = user.genrateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Something went wrong during genrating the tokens');
    }
}

const userRegister = asyncHandler(async (req, res) => {
    // get the information sent by the user from frontend side
    // validate all the fields that are necessary i.e check is user sends some empty info.
    // check if the user is already exists or not
    // extract the filepath from the request body of avatar and photo
    // also validate them  
    // now make an userSchema or user model
    // use the jwt to genrate the token and set it into user browser as a cookie
    // store the info into db and send the response to client side 

    const { username, email, password, location, contact_number } = req.body;

    if ([username, email, password, location, contact_number].some((item) => item?.trim() === '')) {
        throw new ApiError(500, 'Please fill the fields')
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError(500, 'User is already exists');
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Something went wrong during uploading the avatar on cloudinary");
    }

    const avatarURL = await UploadOnCloudinary(avatarLocalPath);

    const RegisteredUser = await User.create({
        username,
        email,
        password,
        location,
        contact_number,
        avatar: avatarURL.url,
        avatarPublicId: avatarURL.public_id,
    })

    // When we sending the response to the user we doesnt want to sent the password and refreshtoken althought they are already encrypted so we remove them from the Schema, we already know that when we save any information inside mongodb than it automatically genrates an _id correspomding to that info so using that we can searcg that user easily in our db.
    // These tokens are genrated also when user first time register not only when user login so we have to do this task additionally also.
    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(RegisteredUser._id);

    const finalResponse = await User.findById(RegisteredUser._id).select('-password -refreshToken').populate('channel');
    if (!finalResponse) {
        throw new ApiError(500, 'Something went wrong');
    }

    const options = {
        httpOnly: true,
        secure: false,      // ❌ set to false for localhost
        sameSite: "Lax",    // 👈 recommended for local dev
    }

    return res
        .status(201)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200, finalResponse, 'User is registered Successfully!!!')
        )
})

const userLogin = asyncHandler(async (req, res) => {
    // extract username,email and password from the request
    // validate the three feilds that they are presented or not
    // search the user in db on the basis of the username or email
    // now check the password
    // genrate access and refresh tokens
    // sent them to user either as cookie and save them  into db

    let { username, email, password } = req.body;
    if ([username, email, password].some((item) => { item?.trim() === '' })) {
        throw new ApiError(401, 'All feilds are requried');
    }

    let user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, 'User does not exists');
    }
    // The point to remenber here is that our all the methods which we created in our user model are only be accessile on the user model instance i.e the user details which we have find in the above query User and user both are differnet (User -> is the main model),(user -> is the instance of this model), in User mongodbs methods like findone are available.

    const passwordValidate = await user.ispasswordCorrect(password);
    if (!passwordValidate) {
        throw new ApiError(401, 'Password is incorrect');
    }
    // Now we genrate the access token and refresg tokens, this work will be done many times so we create this logic inside the function ti increase the usability of the code.
    const { accessToken, refreshToken } = await genrateAccessAndRefreshTokens(user._id);
    const LoggedInUser = await User.findById(user._id).select('-password  -refreshToken').populate('channel');
    const options = {
        httpOnly: true,
        secure: false,      // ❌ set to false for localhost
        sameSite: "Lax",    // 👈 recommended for local dev
    }
    //To set the cookie we uses the res.cookie and to read the cookiw we uses the req.cookie

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: LoggedInUser, accessToken, refreshToken
                },
                "User login successfully!!!"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    // This method is used when our accessToken becomes expire and through the help of refresh token we will refresh it successfully.
    // When genrating the access token it is recommended that we also genrate as new refresh token duee to security reasons.
    // req.headers.authorization method is used when we send accessToken so there is no need to use it here.Secondly when jwt verify our token so there is no need to check the condition beacuse it automatically throw an error if there is any problem.
    const incommingrefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incommingrefreshToken) {
        throw new ApiError(404, "Token is not found");
    }

    try {
        const decodedToken = jwt.verify(incommingrefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);
        if (!user) {
            throw new ApiError(401, "Token is invalid");
        }

        if (incommingrefreshToken !== user.refreshToken) {
            throw new ApiError(401, 'Refresh Token is expired')
        }

        const { accessToken, newRefreshToken } = await genrateAccessAndRefreshTokens(user._id);
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("newRefreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    'AccessToken refreshed successfully!!!'
                ))
    } catch (error) {
        throw new ApiError(401, "Inavlid Refresh Token")
    }
})

const userLogout = asyncHandler(async (req, res) => {
    // The main problem here is that we want to logout user but we doesnt have any credentials of the user, in login the user sends its credentials through the form but during the logout it doesnt provide anytype of details so what we will do is we will make a middleware in which using the cookie we extract the accesstoken and using the jwt we will verify(decrypt) it now in this we have _id in payload part so add a object into our req and than in this function we will use this to find that user removes its refresh tokens and successfully logs out that user.
    // This function performs both find and update the neccessary fields in db so make our work easy.
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: false,      // ❌ set to false for localhost
        sameSite: "Lax",    // 👈 recommended for local dev
    }
    return res
        .status(201)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, 'User Loggout successfully'));
})

const addToWatchHistory = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { videoId } = req.params;
    const user = await User.findById(userId);

    // remove if already watched (avoid duplicates)
    user.watchHistory = user.watchHistory.filter(
        item => item.video.toString() !== videoId
    );

    user.watchHistory.unshift({ video: videoId });
    await user.save();

    res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Video added to watch history")
        );
})

const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("watchHistory.video");
    res
        .status(200)
        .json(new ApiResponse(201, { user }, "Watched Videos!!!"));
})

const updatePassword = asyncHandler(async (req, res) => {
    //Always use throw keyword for apiError if you uses return it does nothing and doesnt stops the flow of execution so always uses throw keyword with error.
    // In this we doesnt requrierd to use the middlware acuse through user we get its email so we can search that user in our db.

    const { email, oldPassword, newPassword } = req.body;
    if ([email, oldPassword, newPassword].some(item => item.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, 'User does not exists');
    }

    const isPasswordValid = await user.ispasswordCorrect(oldPassword);
    if (isPasswordValid === false) {
        throw new ApiError(402, 'Password is incorrect');
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(
            new ApiResponse(201, {}, 'Password is updated successfully')
        )
})

const updateCredentials = asyncHandler(async (req, res) => {
    // Update credentials only include new info so we doesnt have any previous info on the basis of which we can find the user in our db.
    const { username, email, location, contact_number } = req.body;

    if (!username && !email && !location && !contact_number &&
        !req.file) {
        throw new ApiError(400, "Enter at least one credential to update");
    }

    const updatedCredentials = {};
    if (username) updatedCredentials.username = username;
    if (email) updatedCredentials.email = email;
    if (location) updatedCredentials.location = location;
    if (contact_number) updatedCredentials.contact_number = contact_number;
    if (req.file?.path) {
        const avatar = await UploadOnCloudinary(req.file.path);
        if (!avatar?.url) {
            throw new ApiError(400, "Error while uploading avatar");
        }
        updatedCredentials.avatar = avatar.url;
        updateCredentials.avatarPublicId = avatar.public_id;
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id, { $set: updatedCredentials },
        { new: true }
    ).select('-password -refreshToken');

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, 'Your credentials are updated successfully'))
})

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }
    await deleteFromCloudinary(user.avatarPublicId, "image");


    if (user.channel) {
        const channel = await Channel.findById(user.channel);
        if (channel) {
            await deleteFromCloudinary(channel.logoPublicId, "image");
            await deleteFromCloudinary(channel.bannerPublicId, "image");

            const channelVideos = await Video.find({ owner: channel.owner});

            for (const video of channelVideos) {
                await deleteFromCloudinary(video.videoPublicId, "video");
                await deleteFromCloudinary(video.thumbnailPublicId, "image");}

            await Video.deleteMany({ owner: channel.owner });
            await channel.deleteOne();
        }
    }

    await User.findByIdAndDelete(userId);
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",});

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Users Account Deleted Successfully!!!")
        );
})

export { userRegister, userLogin, refreshAccessToken, userLogout, addToWatchHistory, getWatchHistory, updatePassword, updateCredentials, deleteUser }