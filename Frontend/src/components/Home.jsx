import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Welcome from './Welcome';
import TeacherInfoCard from './TeacherInfoCard';

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');

    if (storedToken) {
      setToken(storedToken);
      console.log("Token retrieved from session storage:", storedToken);
    } else {
      // Token is not present, call logout API and redirect to login
      const handleLogout = async () => {
        try {
          await axios.post('http://localhost:5000/api-v1/logout'); // Adjust the URL as needed
          sessionStorage.removeItem('token'); // Clear token from session storage
          navigate('/teacher-login'); // Redirect to login page
        } catch (error) {
          console.error('Error during logout:', error);
          navigate('/teacher-login'); // Redirect to login page on error as well
        }
      };

      handleLogout();
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
        <Welcome />
        {/* Optionally, you can pass the token to other components if needed */}
        {/* <TeacherInfoCard token={token} /> */}
      </div>
    </div>
  );
};

export default Home;
