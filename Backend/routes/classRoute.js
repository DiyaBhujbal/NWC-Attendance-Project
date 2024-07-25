import express from "express";
import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  getSubjectsByClassId,
  getStudentsByClassId
} from "../controllers/classController.js";

const router = express.Router();

// Class routes
router.post("/create-class", createClass);
router.get("/get-all-classes", getAllClasses);
router.get("/get-class/:classId", getClassById);
router.put("/update-class/:classId", updateClass);
router.delete("/delete-class/:classId", deleteClass);
router.get('/:classId/subjects', getSubjectsByClassId); // New route to fetch subjects
router.get('/:classId/students-list', getStudentsByClassId)
export default router;