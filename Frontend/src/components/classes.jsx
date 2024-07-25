import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './classes.css'; // Create this file for styling

const Classes = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [classLabels, setClassLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    // Load class labels from localStorage when the component mounts
    const storedLabels = JSON.parse(localStorage.getItem('classLabels'));
    if (storedLabels) {
      setClassLabels(storedLabels);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleClick = (label) => {
    setSelectedClass(label);
    console.log(`${label} button clicked`);
    navigate('/daily-lec-report');
  };

  const handleAddLabel = () => {
    if (newLabel.trim() !== '') {
      const updatedLabels = [...classLabels, newLabel];
      setClassLabels(updatedLabels);
      setNewLabel('');
      // Save updated labels to localStorage
      localStorage.setItem('classLabels', JSON.stringify(updatedLabels));
    }
  };

  const handleRemoveLabel = (label) => {
    if (window.confirm(`Are you sure you want to remove ${label}?`)) {
      const updatedLabels = classLabels.filter(item => item !== label);
      setClassLabels(updatedLabels);
      // Save updated labels to localStorage
      localStorage.setItem('classLabels', JSON.stringify(updatedLabels));
    }
  };

  const handleLogout = () => {
    // Simulate logout process
    console.log('Logout successful');
    // Redirect to login page
    window.location.href = '/'; 
  };

  return (
    <div className="dashboard">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="add-label">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Enter Class Name"
        />
        <button onClick={handleAddLabel}>Add Class</button>
      </div>

      <div className="main-content">
        <div className="button-grid">
          {classLabels.map(label => (
            <div key={label} className="grid-item">
              <button
                className={`grid-button ${selectedClass === label ? 'selected' : ''}`}
                onClick={() => handleClick(label)}
              >
                {label}
                <span className="remove-icon" onClick={(e) => { e.stopPropagation(); handleRemoveLabel(label); }}>
                  &times;
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classes;
