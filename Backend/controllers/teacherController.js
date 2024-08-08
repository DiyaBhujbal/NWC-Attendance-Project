import mongoose from "mongoose";
import Teacher from "../models/teacher.js";
import OTP from '../models/otp.js'; // Model to store OTPs
import crypto from 'crypto'; // For ES Modules
import { sendEmail } from "../utils/sendEmail.js"; // Utility function for sending emails
import bcrypt from 'bcryptjs';

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




export const getTeacher = async (req, res) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is in your environment variables
    const id = decoded.userId; // Assuming the token contains a `userId` field

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid Teacher ID: ${id}`,
      });
    }

    // Fetch teacher details
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found',
      });
    }

    // Remove password from response
    teacher.password = undefined;

    res.status(200).json({
      success: true,
      teacher,
    });
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


// Endpoint to request password reset (generate OTP)
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate OTP
    const expiresIn = Date.now() + 3600000; // OTP expires in 1 hour

    await OTP.create({ email, otp, expiresIn }); // Save OTP to database

    await sendEmail(email, 'Password Reset OTP', `Your OTP is: ${otp}`);

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Endpoint to verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
      const record = await OTP.findOne({ email, otp });
      if (!record || Date.now() > record.expiresIn) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// Endpoint to reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
      const record = await OTP.findOne({ email, otp });
      if (!record || Date.now() > record.expiresIn) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await Teacher.updateOne({ email }, { password: hashedPassword });

      await OTP.deleteOne({ email, otp }); // Remove OTP after use

      res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};