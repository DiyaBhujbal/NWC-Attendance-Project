import Teacher from "../models/teacher.js";
import bcrypt from 'bcryptjs';
import { createJWT } from "../utils/generateToken.js";

export const register = async (req, res, next) => {
    const { username, email, password } = req.body;
     //validate fileds

  if (!username) {
    next("user Name is required");
  }
  if (!email) {
    next("Email is required");
  }

  if (!password) {
    next("Password is required");
  }

  try {
    const teacherExist = await Teacher.findOne({ email });

    if (teacherExist) {
      next("Email Address already exists");
      return;
    }

    const teacher = await Teacher.create({
        username,
        email,
        password,
      });

      // user token
    const token = await teacher.createJWT();

    res.status(201).send({
      success: true,
      message: "Account created successfully",
      teacher: {
        _id: teacher._id,
        username: teacher.username,
        email: teacher.email,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      //validation
      if (!email || !password) {
        next("Please Provide A User Credentials");
        return;
      }
  
      // find user by email
      const teacher = await Teacher.findOne({ email }).select("+password");
  
      if (!teacher) {
        next("Invalid -email or password");
        return;
      }
  
      // compare password
      const isMatch = await teacher.comparePassword(password);
  
      if (!isMatch) {
        next("Invalid email or password");
        return;
      }

      teacher.password = undefined;

      const token = teacher.createJWT();
  
      res.status(201).json({
        success: true,
        message: "Login successfully",
        teacher,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
  };

  // logout
  export const logout = async (req, res, next) => {
    try {
      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  //get current user

export const getCurrentUser = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id); // req.user.id should be set by authentication middleware

    if (!teacher) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: teacher._id,
        username: teacher.username,
        email: teacher.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};