import React from 'react';
import axios from 'axios';
import './Navbar.css'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';
const Navbar = ({ toggleSidebar}) => {
 
  const navigate = useNavigate();







  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api-v1/auth/logout');
      sessionStorage.clear();
      navigate('/teacher-login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };



  return (
    <div className="navbar">
      <div className="navbar__toggle" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
        <span className="navbar__title">NWC</span>
      </div>
      <div className="navbar__user">
        <span className="navbar__logout" onClick={handleLogout}>Sign Out</span>
        <i className="fas fa-power-off navbar__logout" onClick={handleLogout}></i>
      </div>
    </div>
  );
};

export default Navbar;
