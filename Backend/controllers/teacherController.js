import mongoose from "mongoose";
import Teacher from "../models/teacher.js";
import OTP from '../models/otp.js'; // Model to store OTPs
import crypto from 'crypto'; // For ES Modules
import { sendEmail } from "../utils/sendEmail.js"; // Utility function for sending emails
import bcrypt from 'bcryptjs';


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

    await sendEmail(email, 'Password Reset OTP', `Nowrosjee Wadia College Attendance Monitoring System.\n Your one time password for resetting password is: ${otp}`);

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

