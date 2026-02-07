import mongoose, { Schema } from 'mongoose';

const videoSchema = new mongoose.Schema({
    videoClip: {
        type: String,
        required: [true, 'Vedioclip is requried']
    },
    videoPublicId: {
        type:String
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail is requried"]
    },
    thumbnailPublicId:{
        type:String
    },
    title: {
        type: String,
        required: [true, "Please enter some title"]
    },
    description: {
        type: String,
        required: [true, "Please enter some description"]
    },
    category: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true});

videoSchema.index({
    title:"text",
    description:"text",
    category:"text"
});

export const Video = new mongoose.model('Video', videoSchema)