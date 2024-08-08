import express from "express";
import { rateLimit } from "express-rate-limit";
import { login, logout, register,getCurrentUser,verifyEmail,resendVerificationEmail} from "../controllers/authController.js";
import userAuth from '../middleware/authMiddleware.js'; // Middleware to authenticate the token

//ip rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

// Register routes
router.post("/register", limiter, register);
router.post("/login", login);
router.post("/logout", logout);
router.get('/me', getCurrentUser);
router.post("/verify-email",verifyEmail);
router.get("/verify-email",verifyEmail);
router.post("/resend-verify-email",resendVerificationEmail);
router.get("/resend-verify-email",resendVerificationEmail);

export default router;
