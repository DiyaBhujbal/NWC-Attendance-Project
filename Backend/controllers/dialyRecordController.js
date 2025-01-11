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
    const {  date, day, time, className, subject, periodNo, roomNo, remark, totalStudentstrue,attendanceEntry,note,academicyear } = req.body;
    
    
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
      total_students_true: totalStudentstrue,
      attendance: attendanceEntry,
      note,
      academicyear,
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
export const updateDailyRecord = async (req, res) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Debugging log

  try {
    if (!req.body.user) {
      return res.status(400).json({ message: "User information is required" });
    }

    const { teacherId } = req.body.user;
    const { recordId, attendanceEntry, ...updateData } = req.body;

    // Find the teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the specific daily record
    const record = teacher.dailyRecord.id(recordId);
    if (!record) {
      return res.status(404).json({ message: "Daily record not found" });
    }

    // Merge updated fields into the existing record
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        record[key] = updateData[key]; // Update only fields provided in the request
      }
    });

    // Only update attendance if a new attendanceEntry is provided
    if (attendanceEntry) {
      record.attendance = attendanceEntry;
    }

    await teacher.save();

    res.status(200).json({ success: true, dailyRecord: record });
  } catch (error) {
    console.error(error);
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



  export const getDefaulterStudents = async (req, res) => {
    const { user, className, subject, threshold } = req.body; // Destructure threshold from request body
  
    if (!user || !user.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!className || !subject) {
      return res.status(400).json({ message: "Class name and subject are required" });
    }
  
    const { userId } = user;
    const ATTENDANCE_THRESHOLD = threshold;  // Use threshold from the request body or default to 100
  
    try {
      // Fetch teacher details
      const teacher = await Teacher.findById(userId);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }
  
      // Fetch class details
      const classDetails = await Class.findOne({ name: className });
      if (!classDetails) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      // Aggregate attendance records by subject and class
      const studentAttendance = teacher.dailyRecord
        .filter((record) => record.className === className && record.subject === subject) 
        .reduce((attendanceMap, record) => {
          if (record.attendance && Array.isArray(record.attendance)) {
            record.attendance.forEach(({ roll_no, status }) => {
              if (!attendanceMap[roll_no]) {
                attendanceMap[roll_no] = { totalClasses: 0, attendedClasses: 0 };
              }
              attendanceMap[roll_no].totalClasses++;
              if (status) attendanceMap[roll_no].attendedClasses++;
            });
          }
          return attendanceMap;
        }, {});
  
      // Calculate total number of classes based on the length of attendance records
      const totalClasses = teacher.dailyRecord.filter(
        (record) => record.className === className && record.subject === subject
      ).length;
  
      // Map student attendance and calculate attendance percentages
      const allStudentsAttendance = classDetails.studentsList.map(({ roll_no, student_name }) => {
        const attendance = studentAttendance[roll_no] || { totalClasses: 0, attendedClasses: 0 };
        const attendancePercentage = totalClasses
          ? (attendance.attendedClasses / totalClasses) * 100
          : 0;
  
        return {
          roll_no,
          student_name,
          attendancePercentage: attendancePercentage.toFixed(2),
        };
      });
  
      // Filter defaulters based on the threshold
      const defaulters = allStudentsAttendance.filter(
        (student) => parseFloat(student.attendancePercentage) <= ATTENDANCE_THRESHOLD
      );
  
      console.log(defaulters);
      // Return defaulters
      return res.status(200).json({ success: true, defaulters });
    } catch (error) {
      console.error("Error fetching defaulters:", error);
      return res.status(500).json({ message: "Error fetching defaulters", error });
    }
  };
  




export const getAttendanceByDailyRecordId = async (req, res) => {
  const { user, dailyRecordId } = req.body;

  // Validate request parameters
  if (!user || !user.userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  if (!dailyRecordId) {
    return res.status(400).json({ message: "Daily record ID is required" });
  }

  const { userId } = user;

  try {
    // Fetch teacher details
    const teacher = await Teacher.findById(userId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Find the specific daily record by its ID
    const dailyRecord = teacher.dailyRecord.id(dailyRecordId); // Assuming dailyRecord is an array of subdocuments
    if (!dailyRecord) {
      return res.status(404).json({ message: "Daily record not found" });
    }

    // Extract the className and subject from the dailyRecord
    const { className, subject, attendance } = dailyRecord;

    // Fetch class details
    const classDetails = await Class.findOne({ name: className });
    if (!classDetails) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Process attendance data for this daily record
    const attendanceData = attendance.reduce((attendanceMap, { roll_no, status }) => {
      if (!attendanceMap[roll_no]) {
        attendanceMap[roll_no] = { totalClasses: 0, attendedClasses: 0 };
      }
      attendanceMap[roll_no].totalClasses++;
      if (status) attendanceMap[roll_no].attendedClasses++;
      return attendanceMap;
    }, {});

    // Calculate total classes based on the dailyRecord
    const totalClasses = teacher.dailyRecord.filter(
      record => record.className === className && record.subject === subject
    ).length;

    // Map over the students list and calculate attendance percentage
    const studentsAttendance = classDetails.studentsList.map(student => {
      const { roll_no, student_name } = student;
      const attendance = attendanceData[roll_no] || { totalClasses: 0, attendedClasses: 0 };
      const attendancePercentage = totalClasses
        ? (attendance.attendedClasses / totalClasses) * 100
        : 0;

      return {
        roll_no,
        student_name,
        attendancePercentage: attendancePercentage.toFixed(2), // Round to 2 decimal places
      };
    });

    // Return the attendance details
    return res.status(200).json({
      success: true,
      totalClasses,
      attendance: studentsAttendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return res.status(500).json({ message: "Error fetching attendance", error });
  }
};
