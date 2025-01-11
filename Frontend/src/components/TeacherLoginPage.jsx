import React, { useState, useEffect } from 'react';
import './TeacherLoginPage.css';
import { CollegeImage, CollegeLogo } from '../assets'; // Ensure these paths are correct
import Popup from './popup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
   
    const token = sessionStorage.getItem('token');
    if (token) {
      
      if (window.confirm("Logging out..")) {
        sessionStorage.clear(); 
        navigate('/teacher-login');
      } else {
        navigate('/home-page'); 
      }
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); 
  
    try {
      const response = await axios.post('http://localhost:5000/api-v1/auth/login', { email, password });
  
      if (response.data.success) {
        const { token, user } = response.data;
        sessionStorage.clear();
        sessionStorage.setItem('token', token); 
        sessionStorage.setItem('user', JSON.stringify(user)); 
        console.log("Token and user saved to session storage:", token, user);
        setShowPopup(true); 
      } else {
        setError(response.data.message || 'An error occurred during login');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data.message || 'An error occurred during login');
    } finally {
      setIsLoading(false); 
    }
  };
  
  const handleResendVerification = async () => {
    setIsResending(true); 
    
    try {
      const response = await axios.post('http://localhost:5000/api-v1/auth/resend-verify-email', { email });
  
      if (response.data.success) {
        setError('Verification email resent. Please check your inbox on desktop!.');
      }
    } catch (err) {
      console.error('Resend verification failed', err);
      setError(err.response?.data.message || 'An error occurred while resending the verification email');
    } finally {
      setIsResending(false); 
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/home-page'); 
  };

  return (
    <div className="TeacherLoginPage">
      <div className="login-container">
        <img src={CollegeImage} alt="College" className="college-image" />
        <div className="login-form">
          <img src={CollegeLogo} alt="College Logo" className="college-logo" />
          <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="email" 
                placeholder='Enter your email id'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <div className="input-with-toggle">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <span
                  className={`input-toggle-btn ${showPassword ? 'active' : ''}`}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            
            {isLoading && <div className="loading-spinner"></div>}
            
            <button type="submit" className="login-button">Login as a Teacher</button>
  
            <div className="form-group">
              <a href="/teacher-registration">Don't have an Account? Register Now!</a>
            </div>
  
            <div className="form-group">
              <a href="/forgot-pass">Forgot password?</a>
            </div>
            
            <div className="form-group">
              <button
                type="button"
                onClick={handleResendVerification}
                className="resend-button"
                disabled={isResending} 
              >
                {isResending ? 'Sending...' : 'Verify your account'}
              </button>
            </div>
  
            <div className="form-group">
              <a href="/">Go Back</a>
            </div>
          </form>
        </div>
      </div>
      {showPopup && (
        <Popup
          message="Login successful! Redirecting to dashboard..."
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default TeacherLoginPage;
