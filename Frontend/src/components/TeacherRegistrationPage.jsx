// import React, { useState } from 'react';
// import axios from 'axios';
// import './TeacherRegistrationPage.css';
// import { CollegeImage, CollegeLogo, GoogleLogo } from '../assets';

// const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// const TeacherRegisterPage = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
    
//     if (!PASSWORD_REGEX.test(password)) {
//       setError('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:5000/api/teachers/teacher-registration', {
//         username,
//         password,
//         email,
//       });

//       if (response.data.success) {
//         setShowPopup(true); // Show the popup on success
//       } else {
//         setError(response.data.msg);
//       }
//     } catch (error) {
//       console.error('Error during registration:', error);
//       setError('Teacher already exists');
//     }
//   };

//   const togglePasswordVisibility = (field) => {
//     if (field === 'password') {
//       setShowPassword(!showPassword);
//     } else if (field === 'confirmPassword') {
//       setShowConfirmPassword(!showConfirmPassword);
//     }
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//     window.location.href = '/teacher-home'; // Redirect after closing the popup
//   };

//   return (
//     <div className="TeacherRegisterPage">
//       <div className="register-container">
//         <img src={CollegeImage} alt="College" className="college-image" />
//         <div className="register-form">
//           <img src={CollegeLogo} alt="College Logo" className="college-logo" />
//           <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <input
//                 type="text"
//                 name="username"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email Id"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <div className="input-with-toggle">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className={`input-toggle-btn ${showPassword ? 'active' : ''}`}
//                   onClick={() => togglePasswordVisibility('password')}
//                 >
//                   {showPassword ? 'Hide' : 'Show'}
//                 </span>
//               </div>
//             </div>
//             <div className="form-group">
//               <div className="input-with-toggle">
//                 <input
//                   type={showConfirmPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   placeholder="Confirm Password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//                 <span
//                   className={`input-toggle-btn ${showConfirmPassword ? 'active' : ''}`}
//                   onClick={() => togglePasswordVisibility('confirmPassword')}
//                 >
//                   {showConfirmPassword ? 'Hide' : 'Show'}
//                 </span>
//               </div>
//             </div>
//             {error && <p className="error">{error}</p>}
//             <div className="form-group">
//               <a href="/teacher-login">Log In?</a>
//             </div>
//             <button type="submit" className="register-button">
//               Register as a Teacher
//             </button>
            
//           </form>
//         </div>
//       </div>
//       {showPopup && (
//         <Popup
//           message="Registration successful! Redirecting to dashboard..."
//           onClose={handleClosePopup}
//         />
//       )}
//     </div>
//   );
// };

// export default TeacherRegisterPage;



import React, { useState } from 'react';
import './TeacherRegistrationPage.css';
import { CollegeImage, CollegeLogo } from '../assets';
import Popup from './popup';
import axios from 'axios'; // Import Axios

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const TeacherRegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!PASSWORD_REGEX.test(password)) {
      setError('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
      return;
    }

    try {
      // Make API call to register the teacher
      const response = await axios.post('http://localhost:5000/api-v1/auth/register', { username, email, password });
      
      if (response.data.success) {
        setShowPopup(true); // Show the popup on successful "registration"
      }
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred during registration');
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    window.location.href = '/teacher-login'; // Redirect after closing the popup
  };

  return (
    <div className="TeacherRegisterPage">
      <div className="register-container">
        <img src={CollegeImage} alt="College" className="college-image" />
        <div className="register-form">
          <img src={CollegeLogo} alt="College Logo" className="college-logo" />
          <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="email"
                placeholder="Email Id"
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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className={`input-toggle-btn ${showPassword ? 'active' : ''}`}
                  onClick={() => togglePasswordVisibility('password')}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
            <div className="form-group">
              <div className="input-with-toggle">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <span
                  className={`input-toggle-btn ${showConfirmPassword ? 'active' : ''}`}
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="form-group">
              <a href="/teacher-login">Log In?</a>
            </div>
            <button type="submit" className="register-button">
              Register as a Teacher
            </button>
          </form>
        </div>
      </div>
      {showPopup && (
        <Popup
          message="Registration successful! Please check your email for verification link."
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default TeacherRegisterPage;