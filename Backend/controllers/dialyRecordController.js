import mongoose from "mongoose";
import Teacher from "../models/teacher.js";
import Class from "../models/class.js";



// Add a daily record

export const addDailyRecord = async (req, res) => {
 console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body to debug
 
  try {
    if (!req.body.user) {
      return res.status(400).json({ message: "User information is required" });
    }
    const { teacherId} = req.body.user;
    const {  date, day, time, className, subject, periodNo, roomNo, remark, totalStudentsPresent,attendanceEntry } = req.body;
    
    
    if (!teacherId ) {
      console.log('Missing required fields',  teacherId ); // Additional logging
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log('Looking for teacher with userId:', teacherId); // Log the userId
    
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const newRecord = {
      date,
      day,
      time,
      className,
      subject,
      period_number: periodNo,
      room_number: roomNo,
      remark,
      total_students_present: totalStudentsPresent,
      attendance: attendanceEntry,
    };

    teacher.dailyRecord.push(newRecord);
    await teacher.save();

    res.status(200).json({ success: true, dailyRecord: teacher.dailyRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};





// Update a daily record
export const updateDailyRecord = async (req, res, next) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body to debug

  try {
    if (!req.body.user) {
      return res.status(400).json({ message: "User information is required" });
    }
    
    const { teacherId } = req.body.user;
    const { recordId, attendanceEntry, ...updateData } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const record = teacher.dailyRecord.id(recordId);
    if (!record) {
      return res.status(404).json({ message: "Daily record not found" });
    }

    // Update the record with new data
    Object.assign(record, updateData);

    // Update the attendance entry
    record.attendance = attendanceEntry;

    await teacher.save();

    res.status(200).json({ success: true, dailyRecord: record });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



// Delete a daily record by ID

export const deleteDailyRecord = async (req, res) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body to debug

  try {
    const { teacherId } = req.body.user;
    const { recordId} =req.body;

    if (!teacherId || !recordId) {
      console.log('Missing required fields:', { teacherId, recordId }); // Additional logging
      return res.status(400).json({ message: "Missing required fields" });
    }

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const record = teacher.dailyRecord.id(recordId);
    if (!record) {
      return res.status(404).json({ message: "Daily record not found" });
    }

    // Remove the record from the dailyRecord array
    record.deleteOne();
    await teacher.save();

    res.status(200).json({ success: true, message: "Daily record deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// Get daily records
export const getDailyRecords = async (req, res, next) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body to debug
  
  try {
    if (!req.body.user || !req.body.user.teacherId) {
      return res.status(400).json({ message: "User information with teacherId is required" });
    }
  const { teacherId } = req.body.user; // Extract teacherId from the request body
    // Log the teacherId for debugging
    console.log('Fetching daily records for teacherId:', teacherId);

    // Find the teacher by ID and populate the dailyRecord field
    const teacher = await Teacher.findById(teacherId);
    
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // If found, return the daily records associated with this teacher
    res.status(200).json({ success: true, dailyRecords: teacher.dailyRecord });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred while fetching daily records" });
  }
};




export const addAttendanceEntry = async (req, res, next) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Log the request body to debug

  try {
    if (!req.body.user) {
      return res.status(400).json({ message: "User information is required" });
    }

    const { teacherId } = req.body.user;
    const { attendanceEntry } = req.body;

    if (!teacherId || !attendanceEntry) {
      console.log('Missing required fields', { teacherId, attendanceEntry }); // Additional logging
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log('Looking for teacher with userId:', teacherId); // Log the userId

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      console.log('Teacher not found', { teacherId }); // Additional logging
      return res.status(404).json({ message: "Teacher not found" });
    }

    const newRecord = {
      date: new Date(),
      attendance:  attendanceEntry,
    };

    teacher.dailyRecord.push(newRecord);
    await teacher.save();

    res.status(200).json({ success: true, dailyRecord: newRecord });
  } catch (error) {
    console.log('Error:', error); // Additional logging
    res.status(500).json({ message: error.message });
  }
};



  // Update an attendance entry
  export const updateAttendanceEntry = async (req, res, next) => {
    const { teacherId } = req.body.user;
    const { recordId, rollNo, updateData } = req.body;
  
    try {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const record = teacher.dailyRecord.id(recordId);
      if (!record) {
        return res.status(404).json({ message: "Daily record not found" });
      }
  
      const attendanceEntry = record.attendance.find(entry => entry.roll_no === rollNo);
      if (!attendanceEntry) {
        return res.status(404).json({ message: "Attendance entry not found" });
      }
  
      Object.assign(attendanceEntry, updateData);
      await teacher.save();
  
      res.status(200).json({ success: true, dailyRecord: record });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  // Remove an attendance entry
  export const removeAttendanceEntry = async (req, res, next) => {
    const { userId } = req.body.user;
    const { recordId, rollNo } = req.body;
  
    try {
      const teacher = await Teacher.findById(userId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const record = teacher.dailyRecord.id(recordId);
      if (!record) {
        return res.status(404).json({ message: "Daily record not found" });
      }
  
      const attendanceIndex = record.attendance.findIndex(entry => entry.roll_no === rollNo);
      if (attendanceIndex === -1) {
        return res.status(404).json({ message: "Attendance entry not found" });
      }
  
      record.attendance.splice(attendanceIndex, 1);
      await teacher.save();
  
      res.status(200).json({ success: true, dailyRecord: record });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

// Get
  export const getAttendanceEntries = async (req, res, next) => {
    const { userId } = req.body.user;
    const { recordId } = req.body;
  
    try {
      const teacher = await Teacher.findById(userId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      const record = teacher.dailyRecord.id(recordId);
      if (!record) {
        return res.status(404).json({ message: "Daily record not found" });
      }
  
      res.status(200).json({ success: true, attendance: record.attendance });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };



  