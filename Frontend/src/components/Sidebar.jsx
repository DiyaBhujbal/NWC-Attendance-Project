import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Adjust the path if needed

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__close-btn">
        <i className="fas fa-times" onClick={toggleSidebar}></i>
      </div>
      <nav className="sidebar__nav">
        <h3 className="sidebar__title">Teacher Dashboard</h3>
        <ul>
          <li className="sidebar__item" onClick={toggleSidebar}>
            <Link to="/home-page" className="sidebar__link"><i className="fas fa-home"></i> Home</Link>
          </li>
          <li className="sidebar__item" onClick={toggleSidebar}>
            <Link to="/daily-lec-report" className="sidebar__link"><i className="fas fa-chart-line"></i> Daily Lecture/Practical Records</Link>
          </li>
          <li className="sidebar__item" onClick={toggleSidebar}>
            <Link to="/update-daily-lec-report" className="sidebar__link"><i className="fas fa-chart-line"></i>  Lecture/Practical Report</Link>
          </li>
          <li className="sidebar__item" onClick={toggleSidebar}>
            <Link to="/home-page" className="sidebar__link"><i className="fas fa-calendar-alt"></i> Personal Time Table</Link>
          </li>
          {/* <li className="sidebar__item" onClick={toggleSidebar}>
            <Link to="/attendance-sheet" className="sidebar__link"><i className="fas fa-calendar-alt"></i> Student Attendance</Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
