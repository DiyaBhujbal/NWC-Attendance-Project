import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import MainPage from './components/MainPage';
import TeacherLoginPage from './components/TeacherLoginPage';
import TeacherRegisterPage from './components/TeacherRegistrationPage';
import Classes from './components/classes';
import LecRecord from './components/LecRecord';
import AttendanceSheet from './components/AttendanceSheet';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/teacher-login" element={<TeacherLoginPage />} />
        <Route path="/teacher-registration" element={<TeacherRegisterPage/>} />
        <Route path="/home-page" element={<Home />} />
        <Route path="/classes" element={<Classes/>} />
        <Route path="/daily-lec-report" element={<LecRecord/>} />
        <Route path="/attendance-sheet/:classId" element={<AttendanceSheet />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
