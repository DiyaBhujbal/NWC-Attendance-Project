import React,{createContext} from 'react';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';
import Home from './components/Home';
import MainPage from './components/MainPage';
import TeacherLoginPage from './components/TeacherLoginPage';
import TeacherRegisterPage from './components/TeacherRegistrationPage';
import LecRecord from './components/LecRecord';
import AttendanceSheet from './components/AttendanceSheet';
import { AttendanceProvider } from './components/AttendanceContext';
import EmailVerificationPage from './components/EmailVerificationPage';
import ForgotPassword from './components/ForgotPassword';
import RecordTable from './components/RecordTable'
import AboutUs from './components/AboutUs';
import UpdateLecRecordForm from './components/UpdateLecRecordForm';

const App = () => {
  return (
    <Router>
      <AttendanceProvider>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/teacher-login" element={<TeacherLoginPage />} />
        <Route path="/teacher-registration" element={<TeacherRegisterPage/>} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />
        <Route path="/home-page" element={<Home />} />
        <Route path="/daily-lec-report" element={<LecRecord/>} />
        <Route path="/update-daily-lec-report" element={<RecordTable/>} />
        <Route path="/update-daily-lec-report-form" element={<UpdateLecRecordForm/>} />
        <Route path="/attendance-sheet/:classId" element={<AttendanceSheet />} />
        <Route path="/about-us" element={<AboutUs />} />
        {/* Add more routes as needed */}
      </Routes>
      </AttendanceProvider>
    </Router>

  );
};

export default App;
