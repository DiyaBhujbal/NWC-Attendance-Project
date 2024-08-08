import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { getTeacher, updateTeacher,requestPasswordReset,verifyOTP,resetPassword } from "../controllers/teacherController.js";


const router=express.Router()

// GET user
router.post("/get-teacher", userAuth, getTeacher);

// UPDATE USER || PUT
router.put("/update-teacher", userAuth, updateTeacher);

router.post("/req-reset-pass", requestPasswordReset);
router.post("/verify-otp",  verifyOTP);
router.post("/reset-pass",  resetPassword);

export default router;