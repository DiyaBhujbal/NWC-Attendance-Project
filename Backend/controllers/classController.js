import mongoose from "mongoose";
import Class from "../models/class.js";


//create
export const createClass = async (req, res, next) => {
    const { name, subjects, totalStudents,studentsList } = req.body;
  
    try {
      const newClass = new Class({ name, studentsList, subjects, totalStudents });
      await newClass.save();
  
      res.status(201).json({ success: true, class: newClass });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };


  //getall
  export const getAllClasses = async (req, res, next) => {
    try {
      const classes = await Class.find();
  
      res.status(200).json({ success: true, classes });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };


  //get by id
  export const getClassById = async (req, res, next) => {
    const { classId } = req.params;
  
    try {
      const classItem = await Class.findById(classId);
      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      res.status(200).json({ success: true, class: classItem });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  // Update
  export const updateClass = async (req, res, next) => {
    const { classId } = req.params;
    const { name, studentsList, subjects, totalStudents } = req.body;
  
    try {
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        { name, studentsList, subjects, totalStudents },
        { new: true, runValidators: true }
      );
  
      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      res.status(200).json({ success: true, class: updatedClass });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  //delete
  export const deleteClass = async (req, res, next) => {
    const { classId } = req.params;
  
    try {
      const deletedClass = await Class.findByIdAndDelete(classId);
  
      if (!deletedClass) {
        return res.status(404).json({ message: "Class not found" });
      }
  
      res.status(200).json({ success: true, message: "Class deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

// Fetch subjects by class ID
export const getSubjectsByClassId = async (req, res, next) => {
  const { classId } = req.params;

  try {
    const classItem = await Class.findById(classId).select('subjects'); // Fetch only the subjects field
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ success: true, subjects: classItem.subjects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// Get attendance sheet for a class
export const  getStudentsByClassId=  async (req, res) => {
  try {
    const { classId } = req.params;
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.json({ success: true, studentsList: classData.studentsList });
  } catch (error) {
    console.error('Error fetching students list:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
