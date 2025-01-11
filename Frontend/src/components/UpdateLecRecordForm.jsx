
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LecRecord.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const UpdateLecRecordForm = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [periodNo, setPeriodNo] = useState('');
  const [room_number, setroom_number] = useState('');
  const [remark, setRemark] = useState('');
  const [note, setNote] = useState('');
  const [academicyear, setAcademicyear] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const currentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Fetch lecRecordData from session storage and populate form fields
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Your session has expired. Please log in again.");
      sessionStorage.clear();
      navigate('/teacher-login');
      return;
    }

    const lecRecordData = JSON.parse(sessionStorage.getItem('lecRecordData'));
    if (lecRecordData) {
        // Convert comma-separated time slots into an array
        const timeSlotsArray = Array.isArray(lecRecordData.time)
        ? lecRecordData.time
        : typeof lecRecordData.time === 'string'
        ? lecRecordData.time.split(', ')
        : [];
  
      setDate(new Date(lecRecordData.date).toISOString().split('T')[0]);
      setDay(lecRecordData.day || '');
      setSelectedClass(lecRecordData.class || '');
      setSelectedClassName(lecRecordData.className || '');
      setSelectedSubject(lecRecordData.subject || '');
      setSelectedTimeSlots(timeSlotsArray);
      setroom_number(lecRecordData.room_number || '');
      setRemark(lecRecordData.remark || '');
      // Ensure attendance data is available
      setTotalStudents(lecRecordData.attendance ? lecRecordData.attendance.length.toString() : '0');
      setNote(lecRecordData.note || []);
      setAcademicyear(lecRecordData.academicyear || []);
    }
  }, [navigate]);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
        if (response.data.success && Array.isArray(response.data.classes)) {
          setClasses(response.data.classes);
          // Set the selected class name based on the selected class ID
          if (selectedClass) {
            const selectedClassData = response.data.classes.find(cls => cls._id === selectedClass);
            setSelectedClassName(selectedClassData ? selectedClassData.name : '');
          }
        } else {
          console.error('Failed to fetch classes:', response.data.message);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      }
    };
  
    fetchClasses();
  }, [selectedClass]);
  
  

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

  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (selectedClass) {
        try {
           
          const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/time-slots`);
          if (response.data.success && Array.isArray(response.data.timeSlots)) {
            setTimeSlots(response.data.timeSlots);
          } else {
            console.error('Failed to fetch time slots:', response.data.message);
          }
        } catch (error) {
          console.error('Failed to fetch time slots:', error);
        }
      }
    };
  
    fetchTimeSlots();
  }, [selectedClass]);
  

  
  const handleClassChange = (event) => {
    const selectedClassId = event.target.value;
    setSelectedClass(selectedClassId);
  
    // Find and set the class name based on selected class ID
    const selectedClassData = classes.find(cls => cls._id === selectedClassId);
    setSelectedClassName(selectedClassData ? selectedClassData.name : '');
  };
  

    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };

    const handleTimeSlotChange = (event) => {
        const slot = event.target.value;
        setSelectedTimeSlots(prevSlots =>
          prevSlots.includes(slot) ? prevSlots.filter(s => s !== slot) : [...prevSlots, slot]
        );
      };

      const handleAttendanceClick = () => {
        if (!selectedClass || !selectedSubject) {
          alert('Please select a class and subject.');
          return;
        }

       
        if (!Array.isArray(selectedTimeSlots)) {
          console.error("selectedTimeSlots is not an array", selectedTimeSlots);
          return;
        }
      
      

        
        const existingLecRecordData = JSON.parse(sessionStorage.getItem('lecRecordData')) || {};
      
       
        const updatedLecRecordData = {
          ...existingLecRecordData,
          date,
          day,
          time: selectedTimeSlots.join(', '), 
          className: selectedClassName,
          class: selectedClass,
          subject: selectedSubject,
          room_number,
          remark,
          note,
          academicyear,
          totalStudents,
          selectedTimeSlots, 
        };
      
       
        sessionStorage.setItem("lecRecordData", JSON.stringify(updatedLecRecordData));

    
        navigate(`/attendance-sheet/${selectedClass}`);
      };
      



      
      const handleUpdate = async (event) => {
        event.preventDefault();
        setIsLoading(true);
      
        try {
          const lecRecordData = JSON.parse(sessionStorage.getItem("lecRecordData"));  
          const token = sessionStorage.getItem('token');
          const recordId = sessionStorage.getItem('recordId');
          const user = JSON.parse(sessionStorage.getItem('user'));
      
          if (!token || !recordId || !user || !user._id) {
            console.error("Required data not found in sessionStorage");
            setIsLoading(false);
            return;
          }
      
          // Retrieve attendance data from session or fallback to existing data
          const savedAttendance = JSON.parse(sessionStorage.getItem("attendance")) || {};
          const selectedClassAttendance = savedAttendance[lecRecordData.class] || lecRecordData.attendance || [];
      
          const formattedAttendance = selectedClassAttendance.map((entry) => ({
            roll_no: entry.roll_no,
            status: entry.status,
          }));
      
          const data = {
            ...lecRecordData,
            recordId,
            date,
            day,
            time: selectedTimeSlots,
            className: selectedClassName,
            class: selectedClass,
            subject: selectedSubject,
            room_number,
            remark,
            totalStudents,
            note,
            academicyear,
            attendanceEntry: formattedAttendance, // Use existing or updated attendance
            user: { teacherId: user._id },
          };
      
          const response = await axios.put(
            `http://localhost:5000/api-v1/daily-record/update-daily-record/${recordId}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (response.data.success) {
            // Update session storage with the new record data
            const updatedLecRecordData = {
              ...lecRecordData,
              date,
              day,
              time: Array.isArray(selectedTimeSlots) ? selectedTimeSlots.join(', ') : '',
              className: selectedClassName,
              class: selectedClass,
              subject: selectedSubject,
              room_number,
              remark,
              note,
              academicyear,
              totalStudents,
            };
            sessionStorage.setItem("lecRecordData", JSON.stringify(updatedLecRecordData));
      
            // Clear only attendance if it was explicitly marked
            if (savedAttendance[lecRecordData.class]) {
              sessionStorage.removeItem("attendance");
            }
            sessionStorage.removeItem("recordId");
            sessionStorage.removeItem("lecRecordData");
      
            alert("Daily record updated successfully");
            navigate('/update-daily-lec-report');
          } else {
            console.error("Failed to update daily record:", response.data.message);
          }
        } catch (error) {
          console.error("Error updating daily record:", error.response ? error.response.data : error.message);
        } finally {
          setIsLoading(false);
        }
      };
         
        
        // Generate academic years, e.g., 2024-2025
  const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 10; i++) {
      years.push(`${i}-${i + 1}`);
    }
    return years;
  };

  const academicYears = generateAcademicYears(currentYear, 10); // Adjust the count as needed

  const handleAcademicyearChange = (event) => {
    setAcademicyear(event.target.value);
  };
  
  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <h2>Update Daily Lecture Record</h2>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="form-container">
        <form className="lec-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="day">Day:</label>
            <input type="text" id="day" name="day" value={day} readOnly />
          </div>

          <div className="form-group">
          <label htmlFor="class">Class:</label>
          <select
            id="class"
            name="class"
            value={selectedClass}
            onChange={handleClassChange}
            required
            >
            <option value="">Select class</option>
            {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                {cls.name}
                </option>
            ))}
            </select>

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
  <label htmlFor="time">Time:</label>
  <div>
    {timeSlots.map((slot, index) => (
      <div key={index}>
        <input
          type="checkbox"
          id={`time-slot-${index}`}
          value={slot}
          // Pre-select if the time slot is already in selectedTimeSlots
          checked={selectedTimeSlots.includes(slot)}
          onChange={handleTimeSlotChange}
        />
        <label htmlFor={`time-slot-${index}`}>{slot}</label>
      </div>
    ))}
  </div>
</div>


          {/* <div className="form-group">
            <label htmlFor="periodNo">Period No:</label>
            <input type="text" id="periodNo" name="periodNo" value={periodNo} onChange={e => setPeriodNo(e.target.value)} required />
          </div> */}

          <div className="form-group">
            <label htmlFor="room_number">Room No:</label>
            <input type="text" id="room_number" name="room_number" value={room_number} onChange={e => setroom_number(e.target.value)}  />
          </div>

          <div className="form-group">
            <label htmlFor="remark">Remark:</label>
            <textarea id="remark" name="remark" value={remark} onChange={e => setRemark(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="note">Note:</label>
            <textarea
              id="note"
              name="note"
              value={note}
              onChange={e => setNote(e.target.value)}
              
            />
          </div>

          <div className="form-group">
      <label htmlFor="academicyear">Academic Year:</label>
      <select
        id="academicyear"
        name="academicyear"
        value={academicyear}
        onChange={handleAcademicyearChange}
        className="form-control"
      >
        <option value="">Select Academic Year</option>
        {academicYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
          
          <div className="form-group">
            <button type="button" className="mark-attendance-button" onClick={handleAttendanceClick}>Mark Attendance</button>
          </div>
          <div className="form-group full-width"></div>
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Record"}
          </button>
          {isLoading && <div className="loading-spinner"></div>}
        </form>
      </div>
    </div>
  );
};

export default UpdateLecRecordForm;