import React, { useState } from 'react';
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
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const response = await axios.post('http://localhost:5000/api-v1/auth/login', { email, password });

  //     if (response.data.success) {
  //       const token = response.data.token;
  //       localStorage.setItem('token', token); // Save user data
  //       console.log("token saved to local storage:", token);
  //       setToken(token); // Set the token in the state
  //       setShowPopup(true); // Show the popup on successful login
  //       localStorage.setItem('teacherId', user.teacherId); 
  //     }
  //   } catch (err) {
  //     console.error('Login failed', err);
  //     setError(err.response?.data.message || 'An error occurred during login');
  //   }
  //};

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api-v1/auth/login', {
        email,
        password,
      });
  
      console.log('Login Response:', response.data); // Log the response data to debug
  
      const {teacher, token } = response.data;
  
      if (!teacher ||!teacher._id) {
        console.error("teacherId is missing in the user object",teacher);
        return;
      }
  
      localStorage.setItem('user', JSON.stringify(teacher));
      localStorage.setItem('token', token);
      localStorage.setItem('teacherId', teacher._id); // Store teacherId
      setShowPopup(true); // Show the popup on successful login
  
      // Redirect or update state
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
   
      navigate( '/home-page'); // Redirect after closing the popup
   
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
            <div className="form-group">
              <a href="/teacher-registration">Don't have an Account? Register Now!</a>
            </div>
            <button type="submit" className="login-button">Login as a Teacher</button>
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
