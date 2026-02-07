import asyncHandler from "../utiles/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Channel } from "../models/channel.model.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { ApiError } from "../utiles/ApiError.js";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utiles/Cloudinary.js";
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const currentPage = Math.max(parseInt(req.query.page) || 1, 1);
        const itemsPerPage = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 50);
        const skipItems = (currentPage - 1) * itemsPerPage;
        const totalVideos = await Video.countDocuments({ isPublished: true });
        const videos = await Video.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .skip(skipItems)
            .limit(itemsPerPage);

        const finalData = {
            videos,
            currentPage,
            totalPages: Math.ceil(totalVideos / itemsPerPage),
            totalVideos
        }
        return res
            .status(200)
            .json(
                new ApiResponse(200, finalData, "All Published Videos fetched successfully!!!")
            )
    } catch (err) {
        throw new ApiError(500, err.message);
    }
})

const searchedVideos = asyncHandler(async (req, res) => {
    // This contoller is simply performs the task to return the viedos now we have to understand this that there are various ways using that users can search the videos like through the partial title,category and we have to return the response with an limited amount so we have to control the pagination.
    // When user search something in the form of string than that part comes in url after the ? and we can extract that part through the req.query.
    try {
        const { search, category, page = 1, limit = 10 } = req.query;

        // This object helps us to filter our result.
        const obj = { isPublished: true };

        // We have to keep in mind that when user search something it is not necessary it gives the exact title so we uses an mongodb operator i.e $regex which stands for regular expression and it helps us to search the partial match feild:{$regex:pattern} in this syntax feild says in which part we have to partial seach and pattern is the string on the basis we are trying to search.5
        if (search) {
            // "Add a condition to the query that says: only include videos where the title field matches this regular expression."
            /* {
            isPublished: true,
                title: {
                $regex: "funny",
                $options: "i"
                }
            }*/
            obj.title = { $regex: search, $options: "i" };
        }
        if (category) {
            obj.category = category;
        }

        // countDocument is an mongodb function to count the documents on the basis of the filtering object obj,skip(),sort(),limit() these are also the methods of the mongodb where skip tells how many intial doc we have to leave,sort helps to sort all the docs the basis of a particular feild passed as an argument. 
        const sortBy = { createdAt: -1 }
        const skip = (Number(page) - 1) * Number(limit)
        const totalVideos = await Video.countDocuments(obj);

        const videos = await Video.find(obj)
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        return res
            .status(200)
            .json(
                new ApiResponse(201, videos, 'Searched Videos!!!'),
                totalVideos
            )
    } catch (error) {
        throw new ApiError(401, error.message);
    }
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, category, duration, isPublished } = req.body;
    const videoClip = req.files?.videoClip[0]?.path;
    const thumbnail = req.files?.thumbnail[0]?.path;
    if ([title, description, category, duration, isPublished, videoClip, thumbnail].some((item) => String(item).trim() === "")) {
        // If a feild is non string than trim not works and throw error.
        throw new ApiError(401, "Some feilds are requried");
    }

    const videoClipUrl = await UploadOnCloudinary(videoClip);
    const thumbnailUrl = await UploadOnCloudinary(thumbnail);

    const video = await Video.create({
        title,
        description,
        category,
        duration,
        videoClip: videoClipUrl?.url || "",
        videoPublicId:videoClipUrl.public_id,
        thumbnail: thumbnailUrl?.url || "",
        thumbnailPublicId:thumbnailUrl.public_id,
        owner:req.user._id,
        isPublished
    });
    const _id = video._id;
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("id", _id, options)
        .json(
            new ApiResponse(
                200, video, "Your video pulished successfully!!!"
            )
        )
})

const getOwnerVideos = asyncHandler(async (req, res) => {
    try {
        const { handle } = req.params;
        if (!handle) {
            throw new ApiError(404, "Handle not found");
        }

        const channel = await Channel.findOne({ handle });
        if (!channel) {
            throw new ApiError(404, "Channel not found");
        }
        const videos = await Video.find({ owner: new mongoose.Types.ObjectId(channel.owner) });  // here channel.owner is the user id who created that channel and owner feild in video model is also the user id who uploaded that video so we are matching both user ids to get all videos uploaded by that particular channel owner.
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200, videos, "Owner's all videos fetched successfully!!!"
                )
            )
    } catch (error) {
        throw new ApiError(404, "Error fetching owner videos");
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new ApiError(404, "Id not found");
        }
        const video = await Video.findById(id);
        if (!video) {
            throw new ApiError(404, "Video not found");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    201, video, "Video is getted successfully by its Id"
                )
            )
    } catch (error) {
        throw new ApiError(402, 'Something went wrong!!!');
    }
})

const getVideoBySearch = asyncHandler(async (req,res) => {
    const {q,page=1,limit=8} = req.query;
    if(!q){
        throw new ApiError(404,"Search Query is requried");}
    if (q.trim().length < 4 || !/[a-zA-Z0-9]/.test(q.trim())) {
    throw new ApiError(400, "Invalid search query");}

    let videos = await Video.find(
        { $text: { $search: q.trim() } },
        { score: { $meta: "textScore" } }
    ).sort({score:{$meta:"textScore"}});

    if(videos.length === 0){
    // Escape regex special chars
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexPattern = escaped.split("").join(".*");
    const regex = new RegExp(regexPattern, "i");

    videos = await Video.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } }
      ]
    })}

    return res
    .status(200)
    .json(
        new ApiResponse(201,{videos},"Searched Videos!!!")
    )
})

const getRecommendedVideos = asyncHandler(async (req,res) => {
    const {videoId} = req.params;
    const recommendedVideos = [];
    if(!videoId){
        throw new ApiError(404,"VideoId not found");
    }

    // Recommend on the basis of users watch History.
    const watchedVideos = req.user.populate("watchHistory.video");
    if(watchedVideos?.watchHistory?.length){
        const historyVideos = watchedVideos.watchHistory
        .slice(0,10)
        .map(v => v.video)
        .filter(Boolean);
        const historyCategory = historyVideos.map(v => v.category);
        const historyOwner = historyVideos.map(v => v.owner);
        const historyBased = await Video.find({
          _id: {
            $ne: currentVideo._id,
            $nin: historyVideos.map(v => v._id)
          },
          $or: [
            { category: { $in: historyCategory } },
            { owner: { $in: historyOwner } }
          ]
        }).limit(10);
        recommendedVideos.push(...historyBased);
    }

    // Suggest Videos on the basis of the current playing Videos category or its owner.
    const currentVideo = await Video.findById(videoId);
    if(!currentVideo){
        throw new ApiError(404,"Video not found");
    }
    const categoryBased = await Video.find({
        _id: {$ne:videoId},
        $or:[
            {category:currentVideo.category},
            {owner:currentVideo.owner}
        ]
    }).limit(10);
    recommendedVideos.push(...categoryBased);

    // Filter out the common results.
    const uniqueVideos = [];
    const seen = new Set();
     for (const video of recommendedVideos) {
      if (!seen.has(video._id.toString())) {
        seen.add(video._id.toString());
        uniqueVideos.push(video);
      }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201,{uniqueVideos},"Suggested Videos!!!")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    /* If user wants to update the thumbnail feild than we have to use the multer and cloudinary.
    // Main point here is to be remember is that when we directly call the findByIdAndUpdate method it only modify those feilds which are present inside our object now in our object if the title is empty than it also modify our feild with empty string so this is a problem i.e     const updateDetails = {title: title !== "" ? title : "",
            description: description !== "" ? description : "",
            category: category !== "" ? category : "",
    } now to resolve this problem we have to options either firstly find the video by if than if title is present than update it with new one if not than use the same value present in the video instancce get by the search query. */
    const { id } = req.params;
    const thumbnailPath = req.file?.path; // not destructure it 
    const { title, description, category } = req.body
    if (!id) {
        throw new ApiError(404, "Bad Request!!!");
    }
    if ([title, description, category].every((item) => item?.trim() === "")) {
        throw new ApiError(400, "Changing feilds are requried");
    }

    const updateDetails = {};
    ["title", "description", "category"].forEach((field) => {
        const value = req.body[field];
        if (value && value.trim() !== "") {
            updateDetails[field] = value;
        }
    });
    if (thumbnailPath) {
        const thumnailUrl = await UploadOnCloudinary(thumbnailPath);
        updateDetails.thumbnail = thumnailUrl.url;
        updateDetails.thumbnailPublicId = thumnailUrl.public_id
    } 
    // The main point to be remeber here is that it is not necceassry that all feilds present are update the doc so we want only those feild update which are provided so  Use findByIdAndUpdate() with { $set: req.body } to only update provided fields.
    const UpdatedVideo = await Video.findByIdAndUpdate(
        id,
        { $set: updateDetails },
        { new: true } // important
    );
    // important because if video is not found through the id provided by user thsan error,secondly this new object is necessary beacuse through this we only get our newly updated doc without this we get the old doc.
    if (!UpdatedVideo) {
        throw new ApiError(404, "Video not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                200, UpdatedVideo, "Video credentials are successfully updated!!!"))
})

const deleteAVideo = asyncHandler(async (req, res) => {
    // During the destructuring the parameter id is the actual name which is present in our req.params object so we have to keep in mind we can only extract that parameter withs its original name.{ id: '687072e2c376000e5e3844db' } so name it id not videoId or anything else.
    const { id } = req.params;
    try {
        if (!id) {
            throw new ApiError(404, "Bad Request!!!");}

        const video = await Video.findById(id);
        if (!video) {
            throw new ApiError(404, "Video doesnt exist!!!");}

        await deleteFromCloudinary(video.videoPublicId,"video");
        await deleteFromCloudinary(video.thumbnailPublicId,"image");    
        await Video.deleteOne(video);
        
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Video Deleted successfully!!!")
            )
    } catch (error) {
        throw new ApiError(402, "Something went wrong!!!");
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let togglePublishVideo;
    if (!id) {
        throw new ApiError(402, "Bad Request!!!");
    }

    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Not found")
    }

    if (video.isPublished === true) {
        togglePublishVideo = await Video.updateOne(
            { _id: video._id },
            { $set: { isPublished: false } }
        )
    }
    else {
        togglePublishVideo = await Video.updateOne(
            { _id: video._id },
            { $set: { isPublished: true } }
        )
    }
    // const togglePublishVideo = await Video.updateOne(
    // { _id: video._id },
    // { $set: { isPublished: !video.isPublished } }
    // ); This may also work.

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, togglePublishVideo, "Successfully toggled Publish status of the video!!!"
            )
        )
})

export { getAllVideos,publishAVideo,getOwnerVideos, getVideoById,getVideoBySearch,getRecommendedVideos,updateVideo, deleteAVideo,togglePublishStatus }