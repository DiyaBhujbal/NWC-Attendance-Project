import React from 'react';
import axios from 'axios';
import './Navbar.css'; // Adjust the path if needed

const Navbar = ({ toggleSidebar}) => {
 





  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/teacher-login'; // Redirect to login or home page
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
