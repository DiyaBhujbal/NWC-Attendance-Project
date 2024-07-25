import mongoose from "mongoose";
import Teacher from "../models/teacher.js";

export const updateTeacher = async (req, res, next) => {
  const {
    username,
    email,
  } = req.body;

  try {
    if (!username  || !email ) {
      next("Please provide all required fields");
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No Teacher with id: ${id}`);
    }

    const updateTeacher = {
      username,
      email,
      _id: id,
    };

    const teacher = await Teacher.findByIdAndUpdate(id, updateTeacher, { new: true });

    const token = teacher.createJWT();

    teacher.password = undefined;

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      teacher,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getTeacher = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const teacher = await Teacher.findById({ _id: id });

    if (!teacher) {
      return res.status(200).send({
        message: "Teacher Not Found",
        success: false,
      });
    }

    teacher.password = undefined;

    res.status(200).json({
      success: true,
      teacher: teacher,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "auth error",
      success: false,
      error: error.message,
    });
  }
};
