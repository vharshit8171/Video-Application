import cors from 'cors'
import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import { ApiResponse } from "./utiles/ApiResponse.js"
import { globalLimiter } from './middlewares/RateLimiter.middleware.js';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, //important when using cookies or auth tokens
}));
app.use(express.json({ limit: "30kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())
app.use(globalLimiter);

// Importing all the routers
import userRouter from './routes/user.routers.js'
import videoRouter from "./routes/video.routers.js"
import playlistRouter from "./routes/playlist.routers.js"
import channelRouter from "./routes/channel.routers.js"
import authRouter from "./routes/auth.routers.js"

// Implementing the userRouters
app.use('/api/v1/user', userRouter);
app.use('/api/v1/video', videoRouter);
app.use('/api/v1/playlist', playlistRouter);
app.use('/api/v1/channel', channelRouter);
app.use("/api/v1/auth", authRouter);

// Global error handler — catches all unhandled errors from asyncHandler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json(
        new ApiResponse(statusCode, null, message)
    );
});

export { app }