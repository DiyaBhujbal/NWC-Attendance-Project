import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import { CollegeImage, CollegeLogo } from '../assets';
import Popup from './popup'; // Ensure the Popup component exists

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState({
    requestOtp: false,
    verifyOtp: false,
    resetPassword: false
  });

  const requestOtp = async () => {
    setLoading(prevState => ({ ...prevState, requestOtp: true }));
    try {
      const response = await axios.post('http://localhost:5000/api-v1/teacher/req-reset-pass', { email });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data.message || 'Error occurred sending email');
      setShowPopup(true);
    } finally {
      setLoading(prevState => ({ ...prevState, requestOtp: false }));
    }
  };

  const verifyOtp = async () => {
    setLoading(prevState => ({ ...prevState, verifyOtp: true }));
    try {
      const response = await axios.post('http://localhost:5000/api-v1/teacher/verify-otp', { email, otp });
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data.message || 'Error occurred verifying');
      setShowPopup(true);
    } finally {
      setLoading(prevState => ({ ...prevState, verifyOtp: false }));
    }
  };

  const resetPassword = async () => {
    setLoading(prevState => ({ ...prevState, resetPassword: true }));
    try {
      const response = await axios.post('http://localhost:5000/api-v1/teacher/reset-pass', { email, otp, newPassword });
      setMessage(response.data.message);
      if (response.data.success) {
        setStep(1); // Optionally reset the form to start over
      }
    } catch (error) {
      setMessage(error.response?.data.message || 'Error occurred resetting');
      setShowPopup(true);
    } finally {
      setLoading(prevState => ({ ...prevState, resetPassword: false }));
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="ForgotPassword">
      <div className="reset-container">
        <img src={CollegeImage} alt="College" className="college-image" />
        <div className="reset-form">
          <img src={CollegeLogo} alt="College Logo" className="college-logo" />
          <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>
          
          <form>
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
                  <button 
                    type="button" 
                    className="reset-button"
                    onClick={requestOtp}
                    disabled={loading.requestOtp}
                  >
                    {loading.requestOtp ? 'Sending...' : 'Send OTP'}
                  </button>
                </div>
              )}
              {step === 2 && (
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                  />
                  <button 
                    type="button" 
                    className="reset-button"
                    onClick={verifyOtp}
                    disabled={loading.verifyOtp}
                  >
                    {loading.verifyOtp ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </div>
              )}
              {step === 3 && (
                <div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button 
                    type="button" 
                    className="reset-button"
                    onClick={resetPassword}
                    disabled={loading.resetPassword}
                  >
                    {loading.resetPassword ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              )}
              {message && <p className="message">{message}</p>}
            </div>
            <div className="form-group">
              <a href="/teacher-login">Go Back</a>
            </div>
          </form>
        </div>
      </div>
      
      {showPopup && (
        <Popup
          message={message}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
