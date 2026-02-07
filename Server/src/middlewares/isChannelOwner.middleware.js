import { Channel } from "../models/channel.model.js";
import { ApiError } from "../utiles/ApiError.js";
import asyncHandler from "../utiles/asyncHandler.js";

const isChannelOwner = asyncHandler(async (req, res, next) => {
  const {handle}  = req.params;
  const channel = await Channel.findOne({ handle });
  if (!channel) {
    throw new ApiError(403, "You don't have a channel with this handle");
  }

  if (channel.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized: You do not own this channel");
  }

  req.channel = channel;
  next();
});
export { isChannelOwner };