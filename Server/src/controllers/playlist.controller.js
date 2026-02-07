import asyncHandler from "../utiles/asyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";


const createPlaylist = asyncHandler(async (req, res) => {
    // What we are doing is the video user wants to add getted throug two ways either in the params or in body the advantage of body is that we uses an array so that user sends multiple videos and simultanously we upload all at a time
    const { name, description, } = req.body;
    if (name?.trim() === "" || description === "") {
        throw new ApiError(401, "Fields are requried");
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id
    })

    return res.status(200)
        .json(
            new ApiResponse(200, playlist, "Playlsit created successfully!!!")
        )
});

const getUserPlaylist = asyncHandler(async (req, res) => {
    const { _id } = req.user._id;
    if (!_id) {
        throw new ApiError(400, "User ID is required");
    }

    const playlists = await Playlist.find({ owner: _id })
        .sort({ createdAt: -1 })
        .populate("videos", "thumbnail duration title description")
        .select("-__v");

    return res.status(200)
        .json(
            new ApiResponse(200, playlists, "User playlists fetched successfully")
        );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    // User may want to save a video into multiple playlists that is why we acquire playlistId from body not through params.
    const { playlistIds } = req.body;

    if (!videoId || !Array.isArray(playlistIds) || playlistIds.length === 0) {
        throw new ApiError(400, "videoId and playlistIds are required");
    }

    const playlists = await Playlist.find({
        _id: { $in: playlistIds },
        owner: req.user._id,
    });

    if (playlists.length === 0) {
        throw new ApiError(404, "No valid playlists found");
    }

    let updatedCount = 0;
    for (const playlist of playlists) {
        // checking if video saved into playlist or not.
        const alreadyExists = playlist.videos.some(
            (vid) => vid.toString() === videoId
        );
        if (!alreadyExists) {
            playlist.videos.push(videoId);
            await playlist.save();
            updatedCount++;
        }
    }

    return res.status(200).json(
        new ApiResponse(200, { updatedCount }, "Video saved to selected playlists")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is requried!!!");
    }

    /* populate() is a Mongoose method used to automatically replace the referenced ObjectId(s) in your MongoDB documents with actual documents from the referenced collection like this: {title: "My Playlist",
   {"statusCode": 200,
    "data": {
        "_id": "6873273c49655cf326ffbe85",
        "name": "My Playlist",
        "description": "A cool playlist",
        "videos": [{
                "_id": "68731801b77637f0026ca7c2",
                "videoClip": "http://res.cloudinary.com/davcv5qij/raw/upload/v1752373244/b3ng5b09opyps0qus9uj",
                "thumbnail": "http://res.cloudinary.com/davcv5qij/image/upload/v1752373246/j9ch8hnhdnpgwoneyl71.jpg",
                "title": "Just watch this video",
                "description": "This is video is all about how i become a better developer",
                "category": "Technical",
                "duration": 10,
                "likes": 0,
                "comments": 0,
                "isPublished": true,
                "__v": 0
            }],
        "owner": {
            "_id": "687316f1b77637f0026ca7ba",
            "username": "Harshit verma",
            "email": "vharshit8171@gmail.com",
            "password": "$2b$10$AUG05NxkMVwoTXR9gD8RRewrP5DVj6RwBtH1DbFOZImLL5QgiLFNq",
            "location": "Uttar Pradesh",
            "contact_number": 8171820818,
            "avatar": "http://res.cloudinary.com/davcv5qij/image/upload/v1752372971/cr4lu801cgneflzujcsy.jpg",
            "photo": "http://res.cloudinary.com/davcv5qij/image/upload/v1752372974/xjkffgwsceb4tfawwdkm.jpg",
            "createdAt": "2025-07-13T02:16:17.837Z",
            "updatedAt": "2025-07-13T02:16:18.100Z",
            "__v": 0,
            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODczMTZmMWI3NzYzN2YwMDI2Y2E3YmEiLCJpYXQiOjE3NTIzNzI5NzgsImV4cCI6MTc1MzIzNjk3OH0.zy6hZEDxuI7TLN6hLTnNBYqeXnyWiigu64WYPrAKoDA"
        },
        "createdAt": "2025-07-13T03:25:48.089Z",
        "updatedAt": "2025-07-13T03:25:48.089Z",
        "__v": 0
    },
    "message": "Your playlist!!!"}*/

    const playlist = await Playlist.findById(playlistId)
        .populate("videos")
        .populate("owner", "username avatar");
    if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Your playlist!!!")
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId || !videoId) {
        throw new ApiError(400, "Both playlistId or videoId are requried!!!");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(400, "Playlist ID is invalid!!!");}
    if (playlist.owner.toString() !== req.user._id.toString()) {throw new ApiError(403, "Not allowed");}

    const videoExists = playlist.videos.some((vid) => vid.toString() === videoId);
    if (!videoExists) {
        throw new ApiError(400, "Video not found in playlist");
    }
    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    );
    await playlist.save();

    return res.status(200)
        .json(new ApiResponse(200,playlist,"Video is successfully removed from your playlist!!!")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // console.log(req.params);
    if (!playlistId) {
        throw new ApiError(400, "Playlist Id is requried!!!");
    }
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not allowed");
    }
    await playlist.deleteOne();

    return res.status(200)
        .json(
            new ApiResponse(200, deletePlaylist, "Playlist deleted successfully!!!")
        )
})

export { createPlaylist, getUserPlaylist, addVideoToPlaylist, getPlaylistById, removeVideoFromPlaylist, deletePlaylist }