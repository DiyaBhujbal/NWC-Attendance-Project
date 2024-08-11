import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

const MainPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTeacherModuleClick = () => {
    navigate('/teacher-login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="HomePage">
      <nav className="navbar">
        <div className="navbar-brand">NWC Attendance Monitoring System</div>
        <div className="hamburger-menu" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </div>
        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <a href="/">Home</a>
          {/* <a href="/">Contact</a> */}
          <a href="/about-us">About Us</a>
        </div>
      </nav>

      <main className="App-main">
        <div className="module">
          <a href="/" className="module-link">Admin Login</a>
        </div>
        <div className="module">
          <button onClick={handleTeacherModuleClick} className="module-link">Teacher Login</button>
        </div>
      </main>
    </div>
  );
}

export default MainPage;
