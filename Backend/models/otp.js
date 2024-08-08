import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // The OTP will automatically be removed after 5 minutes
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
