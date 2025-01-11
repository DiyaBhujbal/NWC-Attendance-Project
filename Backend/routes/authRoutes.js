import express from "express";
import { rateLimit } from "express-rate-limit";
import { login, logout, register,getCurrentUser,verifyEmail,resendVerificationEmail,updateProfile} from "../controllers/authController.js";
import userAuth from '../middleware/authMiddleware.js'; 


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  standardHeaders: true, 
  legacyHeaders: false, 
});

const router = express.Router();

// Register routes
router.post("/register", limiter, register);
router.post("/login", login);
router.post("/logout", logout);
router.post('/me', getCurrentUser);
router.put('/update-teacher',updateProfile);

router.post("/verify-email",verifyEmail);
router.get("/verify-email",verifyEmail);
router.post("/resend-verify-email",resendVerificationEmail);
router.get("/resend-verify-email",resendVerificationEmail);

export default router;
