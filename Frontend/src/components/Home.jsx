import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Welcome from './Welcome';
import TeacherInfoCard from './TeacherInfoCard';

const Home = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [token, setToken] = useState(null);
  localStorage.setItem('token', token); // Save user data
  console.log("token saved to local storage:", token);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100 p-4">
        <Welcome  />
       
      </div>
    </div>
  );
};

export default Home;
