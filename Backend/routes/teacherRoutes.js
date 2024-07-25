import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { getTeacher, updateTeacher } from "../controllers/teacherController.js";


const router=express.Router()

// GET user
router.post("/get-teacher", userAuth, getTeacher);

// UPDATE USER || PUT
router.put("/update-teacher", userAuth, updateTeacher);

export default router;