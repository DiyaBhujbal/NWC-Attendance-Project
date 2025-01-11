import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { 
  addDailyRecord, 
  updateDailyRecord, 
  deleteDailyRecord, 
  getDailyRecords,
  addAttendanceEntry,
  updateAttendanceEntry,
  removeAttendanceEntry,
  getAttendanceEntries,
  getDefaulterStudents ,
  getAttendanceByDailyRecordId
} from "../controllers/dialyRecordController.js";

const router = express.Router();

// CRUD operations for daily records
router.post("/add-daily-record", userAuth, addDailyRecord);
router.put("/update-daily-record/:recordId", userAuth, updateDailyRecord);
router.delete("/delete-daily-record/:recordId", userAuth, deleteDailyRecord);
router.post("/get-daily-records", userAuth, getDailyRecords);
router.post('/defaulters',getDefaulterStudents);

// Attendance entry routes
router.post("/add-attendance-entry", userAuth, addAttendanceEntry);
router.put("/update-attendance-entry", userAuth, updateAttendanceEntry);
router.delete("/remove-attendance-entry", userAuth, removeAttendanceEntry);
router.get("/get-attendance-entry", userAuth, getAttendanceEntries);
router.get("/getAttendanceByDailyRecordId", getAttendanceByDailyRecordId);

export default router;