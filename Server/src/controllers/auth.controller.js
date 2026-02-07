import asyncHandler from "../utiles/asyncHandler.js"
import { ApiResponse } from "../utiles/ApiResponse.js";

const checkAuth = asyncHandler(async (req, res) => {
    const user = req.user; // Assuming the user information is attached to req.user by middleware 
    return res.status(200).json(
    new ApiResponse(
      true,
      { user: req.user }, // null OR user object
      "Auth check completed"
    )
  );
});

export { checkAuth };