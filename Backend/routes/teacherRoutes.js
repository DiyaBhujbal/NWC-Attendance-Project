import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import {requestPasswordReset,verifyOTP,resetPassword } from "../controllers/teacherController.js";


const router=express.Router()

router.post("/req-reset-pass", requestPasswordReset);
router.post("/verify-otp",  verifyOTP);
router.post("/reset-pass",  resetPassword);

export default router;