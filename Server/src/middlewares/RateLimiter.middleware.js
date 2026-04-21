import rateLimit from "express-rate-limit";

// Global rate limiter middleware
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 100 requests
  message: {
    success: false,
    message: "Too many requests, please try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // only 5 attempts
  message: {
    success: false,
    message: "Too many login attempts, try again later"
  },
  standardHeaders: true,
  legacyHeaders: false,
});
