import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { generateToken } from "../controllers/tokenController.js";


const router=express.Router()

// GET user
router.post("/generate", generateToken);

export default router;