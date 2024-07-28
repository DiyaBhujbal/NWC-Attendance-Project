import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LecRecord.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import { AttendanceContext } from './AttendanceContext';
import './AttendanceSheet'
const LecForm = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [time, setTime] = useState('');
  const [periodNo, setPeriodNo] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [remark, setRemark] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const navigate = useNavigate();
  const [selectedClassName, setSelectedClassName] = useState('');


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const savedFormData = JSON.parse(sessionStorage.getItem("lecFormData"));
    if (savedFormData) {
      setDate(savedFormData.date || '');
      setDay(savedFormData.day || '');
      setSelectedClass(savedFormData.selectedClass || '');
      setSelectedSubject(savedFormData.selectedSubject || '');
      setTime(savedFormData.time || '');
      setPeriodNo(savedFormData.periodNo || '');
      setRoomNo(savedFormData.roomNo || '');
      setRemark(savedFormData.remark || '');
      setTotalStudents(savedFormData.totalStudents || '');
    }
  }, []);

  useEffect(() => {
    if (date) {
      const dateObj = new Date(date);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      setDay(daysOfWeek[dateObj.getUTCDay()]);
    } else {
      setDay('');
    }
  }, [date]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
        if (response.data.success && Array.isArray(response.data.classes)) {
          setClasses(response.data.classes);
        } else {
          console.error('Fetched classes is not an array:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClass) {
        try {
          const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/subjects`);
          if (response.data.success && Array.isArray(response.data.subjects)) {
            setSubjects(response.data.subjects);
          } else {
            console.error('Fetched subjects is not an array:', response.data);
          }
        } catch (error) {
          console.error('Failed to fetch subjects:', error);
        }
      }
    };
    fetchSubjects();
  }, [selectedClass]);

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);
  
    const selectedClass = classes.find(cls => cls._id === classId);
    setSelectedClassName(selectedClass ? selectedClass.name : '');
  };
  
  
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handlePeriodNoChange = (event) => {
    setPeriodNo(event.target.value);
  };

  const handleRoomNoChange = (event) => {
    setRoomNo(event.target.value);
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleTotalStudentsChange = (event) => {
    setTotalStudents(event.target.value);
  };

  const handleAttendanceClick = () => {
    if (!selectedClass || !selectedSubject) {
      alert('Please select both class and subject before proceeding.');
      return;
    }
    const lecFormData = {
      date,
      day,
      time,
      selectedClassName,
      selectedClass,
      periodNo,
      selectedSubject,
      roomNo,
      remark,
      totalStudents,
    };
    sessionStorage.setItem("lecFormData", JSON.stringify(lecFormData));
    navigate(`/attendance-sheet/${selectedClass}`);
  };

  const handleSave = async (event) => {
    event.preventDefault();
  
    try {
      const lecFormData = JSON.parse(sessionStorage.getItem("lecFormData"));
      const savedAttendance = JSON.parse(sessionStorage.getItem("attendance")) || {};
      const selectedClassAttendance = savedAttendance[lecFormData.class] || [];
      
  // Check if attendance data is available
  if (selectedClassAttendance.length === 0) {
    alert("Please mark attendance before saving the form.");
    return; // Prevent the form from being submitted
  }

      const formattedAttendance = selectedClassAttendance.map((entry) => ({
        roll_no: entry.roll_no,
        status: entry.status,
      }));
  
      let token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const teacherId = localStorage.getItem("teacherId");
  
      if (!user || !teacherId) {
        console.error("User or teacherId not found in localStorage");
        return;
      }
  
      //if (!token) {
        const response1 = await axios.post(`http://localhost:5000/api-v1/token/generate`, { teacherId: user._id });
        token = response1.data.token;
        localStorage.setItem("token", token);
      //}
  
      const data = {
        ...lecFormData,
        className: lecFormData.selectedClassName, // Use the class name here
        subject: lecFormData.selectedSubject,

        attendanceEntry: formattedAttendance,
        user: { teacherId },
      };
  
      const response = await axios.post(
        `http://localhost:5000/api-v1/daily-record/add-daily-record`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        alert("Daily record saved successfully");
        sessionStorage.removeItem("attendance");
        sessionStorage.removeItem("lecFormData");
      } else {
        console.error("Failed to save daily record:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving daily record:", error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <h2>Daily Lecture Record</h2>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="form-container">
        <form className="lec-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={date} onChange={handleDateChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="day">Day:</label>
            <input type="text" id="day" name="day" value={day} readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input type="time" id="time" name="time" value={time} onChange={handleTimeChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="class">Class:</label>
            <select id="class" name="class" value={selectedClass} onChange={handleClassChange} required>
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="periodNo">Period no:</label>
            <input type="number" id="periodNo" name="periodNo" value={periodNo} onChange={handlePeriodNoChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <select id="subject" name="subject" value={selectedSubject} onChange={handleSubjectChange} required>
              <option value="">Select subject</option>
              {subjects.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="roomNo">Room no:</label>
            <input type="text" id="roomNo" name="roomNo" value={roomNo} onChange={handleRoomNoChange}  required/>
          </div>
          <div className="form-group">
            <label htmlFor="remark">Remark:</label>
            <textarea id="remark" name="remark" rows="2" value={remark} onChange={handleRemarkChange}  required/>
          </div>
          <div className="form-group">
            <label htmlFor="totalStudents">Total Students Present:</label>
            <input type="number" id="totalStudents" name="totalStudents" value={totalStudents} onChange={handleTotalStudentsChange}  required/>
          </div>
          <div className="form-group">
            <button type="button" className="mark-attendance-button" onClick={handleAttendanceClick}>Mark Attendance</button>
          </div>
          <div className="form-group full-width">
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LecForm;



