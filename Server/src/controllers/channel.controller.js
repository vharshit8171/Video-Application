import asyncHandler from "../utiles/asyncHandler.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Channel } from "../models/channel.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utiles/ApiError.js";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utiles/Cloudinary.js";

const createChannel = asyncHandler(async (req, res) => {
    const { name, handle, description, category, website } = req.body;
    const logoFile = req.files['logo'] ? req.files['logo'][0] : null;

    if (req.user.channel) {
        throw new ApiError(400, "User already has a channel");
    }

    // Validate required fields
    if (!name || !handle || !description) {
        throw new ApiError(400, "Name, handle, and description are required");
    }
    if (!logoFile) {
        throw new ApiError(400, "Logo image is required");
    }

    const existedChannel = await Channel.findOne({ name });
    if (existedChannel) {
        throw new ApiError(400, "Channel with this name already exists");
    }

    const logoPath = req.files?.logo?.[0].path;
    const bannerPath = req.files?.banner?.[0].path || null;
    if (!logoPath) {
        throw new ApiError(400, "Logo image upload failed");
    }

    const logoCloudPath = await UploadOnCloudinary(logoPath);
    let bannerCloudPath = {};
    if (bannerPath) {
        bannerCloudPath = await UploadOnCloudinary(bannerPath);
    }

    const CreatedChannel = await Channel.create({
        name,
        handle,
        description,
        category,
        website: website || null,
        logo: logoCloudPath.url,
        logoPublicId: logoCloudPath.public_id,
        banner: bannerCloudPath.url || null,
        bannerPublicId: bannerCloudPath.public_id || null,
        owner: req.user._id,
    });
    await User.findByIdAndUpdate(req.user._id, { channel: CreatedChannel._id }, { new: true });

    return res
        .status(201)
        .json(new ApiResponse(201, CreatedChannel, "Channel created successfully"));
});

const getMyChannel = asyncHandler(async (req, res) => {
    const channel = await Channel.findOne({ owner: req.user._id });

    if (!channel) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "No channel found for this user"));
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, channel, "Channel fetched successfully")
        );
});

const authChannelByHandle = asyncHandler(async (req, res) => {
    const { handle } = req.params;
    const channel = await Channel.findOne({ handle });
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, channel, "Channel fetched successfully"));
});

const editChannelByHandle = asyncHandler(async (req, res) => {
    const { channel } = req;

    const logoLocalPath = req.files?.logo?.[0]?.path;
    const bannerLocalPath = req.files?.banner?.[0]?.path;

    // Only allow editable fields
    const allowedUpdates = ["name", "description", "category", "website"];
    allowedUpdates.forEach((field) => {
        if (req.body[field]) {
            channel[field] = req.body[field];
        }
    });

    if (logoLocalPath) {
        const logoCloudPath = await UploadOnCloudinary(logoLocalPath);
        channel.logo = logoCloudPath.url;
        channel.logoPublicId = logoCloudPath.public_id
    }

    if (bannerLocalPath) {
        const bannerCloudPath = await UploadOnCloudinary(bannerLocalPath);
        channel.banner = bannerCloudPath.url;
        channel.banner = bannerCloudPath.public_id
    }
    await channel.save();

    return res
        .status(200)
        .json(new ApiResponse(200, channel, "Channel updated successfully")
        );
});

const deleteChannelByHandle = asyncHandler(async (req, res) => {
    try {
        const channel = req.channel;
        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found",
            });
        }

        await deleteFromCloudinary(channel.logoPublicId, "image");
        await deleteFromCloudinary(channel.bannerPublicId, "image");

        const channelVideos = await Video.find({ owner: channel.owner });
        for (const video of channelVideos) {
            await deleteFromCloudinary(video.videoPublicId, "video");
            await deleteFromCloudinary(video.thumbnailPublicId, "image");
        }
        // Removes video docs from DB. 
        await Video.deleteMany({owner:channel.owner});

        await User.findByIdAndUpdate(channel.owner, { $unset: { channel: "" } });
        await Channel.deleteOne({ _id: channel._id });

        return res
            .status(200).json(
                new ApiResponse(200, {}, "Channel Deleted Successfully!!!")
            );
    } catch (error) {
        console.error("Delete Channel Error:", error);
        return res.status(500).json(
            new ApiError(
                500, "Failed to delete Channel"
            )
        )
    }
})


export { createChannel, authChannelByHandle, editChannelByHandle, getMyChannel, deleteChannelByHandle }