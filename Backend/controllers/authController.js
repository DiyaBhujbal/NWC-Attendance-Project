import Teacher from "../models/teacher.js";
import VerificationToken from "../models/verificationToken.js"; // Assuming you have a model for storing verification tokens
import bcrypt from 'bcryptjs';
import { createJWT } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js"; // Utility function for sending emails
import crypto from 'crypto';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url'; // For ES Modules path handling
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();



// Registration

const emailTemplateSource = fs.readFileSync('templates/emailTemplate.handlebars', 'utf8');
const emailTemplate = handlebars.compile(emailTemplateSource);

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate fields
  if (!username || !email || !password) {
    return next('All fields are required');
  }

  try {
    const teacherExist = await Teacher.findOne({ email });

    if (teacherExist) {
      return next('Email Address already exists');
    }

    const teacher = await Teacher.create({
      username,
      email,
      password,
    });

    // Generate a verification token
    const token = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({ token, email });

    // Generate the verification link
    const verificationLink = `http://localhost:5000/api-v1/auth/verify-email?token=${token}`;
    
    // Render the email template with the verification link
    const emailHtml = emailTemplate({
      appName: 'Attendace Monitoring System',
      verificationLink,
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: emailHtml,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).send({
      success: true,
      message: 'Verification email sent. Please check your inbox.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
};



//Verification


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const successTemplatePath = path.join(__dirname, '..','templates', 'verificationSuccess.html');
const errorTemplatePath = path.join(__dirname, '..','templates', 'verificationError.html');

const getTemplate = (filePath, replacements) => {
  let template = fs.readFileSync(filePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, 'g'), value);
  }
  return template;
};

export const verifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    const html = getTemplate(errorTemplatePath, { message: 'Token is required' });
    return res.status(400).send(html);
  }

  try {
    const verificationToken = await VerificationToken.findOne({ token });

    if (!verificationToken) {
      const html = getTemplate(errorTemplatePath, { message: 'The link has been expired!' });
      return res.status(400).send(html);
    }

    const teacher = await Teacher.findOne({ email: verificationToken.email });

    if (!teacher) {
      const html = getTemplate(errorTemplatePath, { message: 'User not found' });
      return res.status(400).send(html);
    }

    teacher.isVerified = true;
    await teacher.save();
    await VerificationToken.deleteOne({ token });

    const html = getTemplate(successTemplatePath, { message: 'Email verified successfully. You can now log in.' });
    return res.status(200).send(html);
  } catch (error) {
    console.error('Error:', error);
    const html = getTemplate(errorTemplatePath, { message: 'An error occurred. Please try again later.' });
    return res.status(500).send(html);
  }
};


// Resend Verification

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (teacher.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate a new verification token
    const token = crypto.randomBytes(32).toString('hex');
    await VerificationToken.create({ token, email });

    // Send verification email
    const verificationLink = `http://localhost:5000/api-v1/auth/verify-email?token=${token}`;
    await sendEmail(email, 'Email Verification', `Please verify your email by clicking this link: ${verificationLink}`);

    res.status(200).json({
      success: true,
      message: 'Verification email resent. Please check your inbox.',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};




//---------------------------------------------------------------------------------------------------------------------------------------


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the teacher by email
    const teacher = await Teacher.findOne({ email });

    // Check if the teacher exists and if the password is correct
    if (!teacher || !await bcrypt.compare(password, teacher.password)) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check if the email is verified
    if (!teacher.isVerified) {
      return res.status(401).json({ success: false, message: 'Email not verified' });
    }

    // Generate JWT token
    const token = JWT.sign({ id: teacher._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Send the response with the token and user data
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: teacher._id,
        username: teacher.username,
        email: teacher.email,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


  //---------------------------------------------------------------------------------------------------------------------------------------



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



  //---------------------------------------------------------------------------------------------------------------------------------------



  //get current user

  export const getCurrentUser = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
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


//---------------------------------------------------------------------------------------------------------------------------------------

