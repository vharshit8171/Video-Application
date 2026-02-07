import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9._-]+$/,
    },
    description: {
      type: String,
      required: true,
      maxlength: 300,
    },
    category: {
      type: String,
      enum: [
        "Education",
        "Technology",
        "Entertainment",
        "Gaming",
        "Music",
      ],
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    logo: {
      type: String,
      required: true,
    },
    logoPublicId: {
      type:String
    },
    banner: {
      type: String,
      default: null,
    },
    bannerPublicId:{
      type:String
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Channel = mongoose.model("Channel", channelSchema);
