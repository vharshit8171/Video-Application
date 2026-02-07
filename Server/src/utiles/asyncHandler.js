// This is a higher order function which takes a function as an argument and return a function this function is mainly made for the dbconnection function.

const asyncHandler = (func) => {
    return async (req, res, next) => {
        try {
            return await func(req, res, next);
        } catch (error) {
            console.log("Error from async handler", error.message);
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export default asyncHandler