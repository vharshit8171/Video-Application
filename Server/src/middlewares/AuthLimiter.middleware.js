import rateLimit from "express-rate-limit";

// Base config (shared logic)
const authLimiter = (max, windowMs, message) =>
  rateLimit({
    max,
    windowMs,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

// Login limiter (strict)
export const loginLimiter = authLimiter(
  5,
  15 * 60 * 1000,
  "Too many login attempts. Try again later."
);

// Signup limiter (less strict)
export const signupLimiter = authLimiter(
  10,
  60 * 60 * 1000,
  "Too many signup attempts. Try again later."
);
