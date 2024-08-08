import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import { CollegeImage, CollegeLogo } from '../assets';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');

    const requestOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api-v1/teacher/req-reset-pass', { email });
            setMessage(response.data.message);
            setStep(2);
        } catch (error) {
            setMessage(error.response?.data.message || 'Error occurred sending email');
        }
    };

    const verifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api-v1/teacher/verify-otp', { email, otp });
            setMessage(response.data.message);
            setStep(3);
        } catch (error) {
            setMessage(error.response?.data.message || 'Error occurred verifying');
        }
    };

    const resetPassword = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api-v1/teacher/reset-pass', { email, otp, newPassword });
            setMessage(response.data.message);
            if (response.data.success) {
                setStep(1); // Optionally reset the form to start over
            }
        } catch (error) {
            setMessage(error.response?.data.message || 'Error occurred resetting');
        }
    };

    return (
      <div className="ForgotPassword">
        <div className="container">
          <img src={CollegeImage} alt="College" className="college-image" />
          <div className="form">
            <img src={CollegeLogo} alt="College Logo" className="college-logo" />
            <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>
            
              <div className="form-group">
                {step === 1 && (
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                        <button type="button" onClick={requestOtp}>Send OTP</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h3>Verify OTP</h3>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            required
                        />
                        <button type="button" onClick={verifyOtp}>Verify OTP</button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h3>Reset Password</h3>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                        <button type="button" onClick={resetPassword}>Reset Password</button>
                    </div>
                )}
                {message && <p className="message">{message}</p>}
              </div>
          </div>
        </div>
      </div>
    );
};

export default ForgotPassword;
