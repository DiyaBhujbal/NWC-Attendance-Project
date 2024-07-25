
// // http://localhost:5000/api/class/${selectedClass}/subjects
// // http://localhost:5000/api-v1/class/get-all-classes

// import React, { useState, useEffect } from 'react';
// import './LecRecord.css';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import axios from 'axios';

// const LecForm = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [date, setDate] = useState('');
//   const [day, setDay] = useState('');
//   const [classes, setClasses] = useState([]); // Initialize as an empty array
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     if (date) {
//       const dateObj = new Date(date);
//       const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//       setDay(daysOfWeek[dateObj.getUTCDay()]);
//     } else {
//       setDay('');
//     }
//   }, [date]);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
//         console.log('Fetched classes:', response.data); // Log the data to debug
//         if (response.data.success && Array.isArray(response.data.classes)) {
//           setClasses(response.data.classes);
//         } else {
//           console.error('Fetched classes is not an array:', response.data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch classes:', error);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (selectedClass) {
//         try {
//           const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/subjects`);
//           console.log('Fetched subjects:', response.data); // Log the data to debug
//           if (response.data.success && Array.isArray(response.data.subjects)) {
//             setSubjects(response.data.subjects);
//           } else {
//             console.error('Fetched subjects is not an array:', response.data);
//           }
//         } catch (error) {
//           console.error('Failed to fetch subjects:', error);
//         }
//       }
//     };
//     fetchSubjects();
//   }, [selectedClass]);

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   const handleClassChange = (event) => {
//     setSelectedClass(event.target.value);
//   };

//   const handleSubjectChange = (event) => {
//     setSelectedSubject(event.target.value);
//   };

//   return (
//     <div>
//       <Navbar toggleSidebar={toggleSidebar} />
//       <h2>Daily Lecture Record</h2>
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="form-container">
//         <form className="lec-form">
//           <div className="form-group">
//             <label htmlFor="date">Date:</label>
//             <input type="date" id="date" name="date" value={date} onChange={handleDateChange} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="day">Day:</label>
//             <input type="text" id="day" name="day" value={day} readOnly />
//           </div>
//           <div className="form-group">
//             <label htmlFor="time">Time:</label>
//             <input type="time" id="time" name="time" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="class">Class:</label>
//             <select id="class" name="class" value={selectedClass} onChange={handleClassChange}>
//               <option value="">Select class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="periodNo">Period no:</label>
//             <input type="number" id="periodNo" name="periodNo" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="subject">Subject:</label>
//             <select id="subject" name="subject" value={selectedSubject} onChange={handleSubjectChange}>
//               <option value="">Select subject</option>
//               {subjects.map((sub, index) => (
//                 <option key={index} value={sub}>
//                   {sub}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="roomNo">Room no:</label>
//             <input type="text" id="roomNo" name="roomNo" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="remark">Remark:</label>
//             <textarea id="remark" name="remark" rows="2" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="totalStudents">Total Students Present:</label>
//             <input type="number" id="totalStudents" name="totalStudents" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="attendance">Attendance:</label>
//             <input type="text" id="attendance" name="attendance" />
//           </div>
//           <div className="form-group full-width">
//             <button type="submit" className="save-button">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LecForm;

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import React, { useState, useEffect } from 'react';
// import './LecRecord.css';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode'; // Import jwtDecode to decode JWT

// const LecForm = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [date, setDate] = useState('');
//   const [day, setDay] = useState('');
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [time, setTime] = useState('');
//   const [periodNo, setPeriodNo] = useState('');
//   const [roomNo, setRoomNo] = useState('');
//   const [remark, setRemark] = useState('');
//   const [totalStudents, setTotalStudents] = useState('');
//   const [attendance, setAttendance] = useState([]);

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     if (date) {
//       const dateObj = new Date(date);
//       const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//       setDay(daysOfWeek[dateObj.getUTCDay()]);
//     } else {
//       setDay('');
//     }
//   }, [date]);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
//         console.log('Fetched classes:', response.data);
//         if (response.data.success && Array.isArray(response.data.classes)) {
//           setClasses(response.data.classes);
//         } else {
//           console.error('Fetched classes is not an array:', response.data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch classes:', error);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (selectedClass) {
//         try {
//           const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/subjects`);
//           console.log('Fetched subjects:', response.data);
//           if (response.data.success && Array.isArray(response.data.subjects)) {
//             setSubjects(response.data.subjects);
//           } else {
//             console.error('Fetched subjects is not an array:', response.data);
//           }
//         } catch (error) {
//           console.error('Failed to fetch subjects:', error);
//         }
//       }
//     };
//     fetchSubjects();
//   }, [selectedClass]);

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   const handleClassChange = (event) => {
//     setSelectedClass(event.target.value);
//   };

//   const handleSubjectChange = (event) => {
//     setSelectedSubject(event.target.value);
//   };

//   const handleAttendanceChange = (index, field, value) => {
//     const newAttendance = [...attendance];
//     newAttendance[index] = { ...newAttendance[index], [field]: value };
//     setAttendance(newAttendance);
//   };

//   const handleAddAttendance = () => {
//     setAttendance([...attendance, { roll_number: '', status: false }]);
//   };

//   const handleRemoveAttendance = (index) => {
//     setAttendance(attendance.filter((_, i) => i !== index));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.error('No token found');
//       return;
//     }

//     const decodedToken = jwtDecode(token);
//     const userId = decodedToken.userId;

//     const dailyRecord = {
//       date,
//       day,
//       time,
//       subject: selectedSubject,
//       room_number: roomNo,
//       period_number: periodNo,
//       class: selectedClass,
//       remark,
//       total_students_present: totalStudents,
//       attendance,
//     };

//     try {
//       const response = await axios.post('http://localhost:5000/api-v1/daily-record/add-daily-record', { userId, dailyRecord }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       console.log('Record saved:', response.data);
//     } catch (error) {
//       console.error('Failed to save record:', error);
//     }
//   };

//   return (
//     <div>
//       <Navbar toggleSidebar={toggleSidebar} />
//       <h2>Daily Lecture Record</h2>
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="form-container">
//         <form className="lec-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="date">Date:</label>
//             <input type="date" id="date" name="date" value={date} onChange={handleDateChange} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="day">Day:</label>
//             <input type="text" id="day" name="day" value={day} readOnly />
//           </div>
//           <div className="form-group">
//             <label htmlFor="time">Time:</label>
//             <input type="time" id="time" name="time" value={time} onChange={(e) => setTime(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="class">Class:</label>
//             <select id="class" name="class" value={selectedClass} onChange={handleClassChange}>
//               <option value="">Select class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="periodNo">Period no:</label>
//             <input type="number" id="periodNo" name="periodNo" value={periodNo} onChange={(e) => setPeriodNo(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="subject">Subject:</label>
//             <select id="subject" name="subject" value={selectedSubject} onChange={handleSubjectChange}>
//               <option value="">Select subject</option>
//               {subjects.map((sub, index) => (
//                 <option key={index} value={sub}>
//                   {sub}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="roomNo">Room no:</label>
//             <input type="text" id="roomNo" name="roomNo" value={roomNo} onChange={(e) => setRoomNo(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="remark">Remark:</label>
//             <textarea id="remark" name="remark" rows="2" value={remark} onChange={(e) => setRemark(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="totalStudents">Total Students Present:</label>
//             <input type="number" id="totalStudents" name="totalStudents" value={totalStudents} onChange={(e) => setTotalStudents(e.target.value)} />
//           </div>
//           <div className="form-group">
//             <label>Attendance:</label>
//             {attendance.map((entry, index) => (
//               <div key={index} className="attendance-entry">
//                 <input
//                   type="number"
//                   placeholder="Roll Number"
//                   value={entry.roll_number}
//                   onChange={(e) => handleAttendanceChange(index, 'roll_number', e.target.value)}
//                 />
//                 <select
//                   value={entry.status}
//                   onChange={(e) => handleAttendanceChange(index, 'status', e.target.value === 'true')}
//                 >
//                   <option value={true}>Present</option>
//                   <option value={false}>Absent</option>
//                 </select>
//                 <button type="button" onClick={() => handleRemoveAttendance(index)}>Remove</button>
//               </div>
//             ))}
//             <button type="button" onClick={handleAddAttendance}>Add Attendance Entry</button>
//           </div>
//           <div className="form-group full-width">
//             <button type="submit" className="save-button">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LecForm;

// ---------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './LecRecord.css';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import axios from 'axios';

// const LecForm = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [date, setDate] = useState('');
//   const [day, setDay] = useState('');
//   const [classes, setClasses] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const token = localStorage.getItem('token'); 
//   const navigate = useNavigate();

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   useEffect(() => {
//     if (date) {
//       const dateObj = new Date(date);
//       const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//       setDay(daysOfWeek[dateObj.getUTCDay()]);
//     } else {
//       setDay('');
//     }
//   }, [date]);

//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
//         console.log('Fetched classes:', response.data); // Log the data to debug
//         if (response.data.success && Array.isArray(response.data.classes)) {
//           setClasses(response.data.classes);
//         } else {
//           console.error('Fetched classes is not an array:', response.data);
//         }
//       } catch (error) {
//         console.error('Failed to fetch classes:', error);
//       }
//     };
//     fetchClasses();
//   }, []);

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       if (selectedClass) {
//         try {
//           const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/subjects`);
//           console.log('Fetched subjects:', response.data); // Log the data to debug
//           if (response.data.success && Array.isArray(response.data.subjects)) {
//             setSubjects(response.data.subjects);
//           } else {
//             console.error('Fetched subjects is not an array:', response.data);
//           }
//         } catch (error) {
//           console.error('Failed to fetch subjects:', error);
//         }
//       }
//     };
//     fetchSubjects();
//   }, [selectedClass]);

//   const handleDateChange = (event) => {
//     setDate(event.target.value);
//   };

//   const handleClassChange = (event) => {
//     setSelectedClass(event.target.value);
//   };

//   const handleSubjectChange = (event) => {
//     setSelectedSubject(event.target.value);
//   };

//   const handleAttendanceClick = () => {
//     if (!selectedClass || !selectedSubject) {
//       alert('Please select both class and subject before proceeding.');
//       return;
//     }
//     navigate(`/attendance-sheet/${selectedClass}`);
//   };

//   return (
//     <div>
//       <Navbar toggleSidebar={toggleSidebar} />
//       <h2>Daily Lecture Record</h2>
//       <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       <div className="form-container">
//         <form className="lec-form">
//           <div className="form-group">
//             <label htmlFor="date">Date:</label>
//             <input type="date" id="date" name="date" value={date} onChange={handleDateChange} />
//           </div>
//           <div className="form-group">
//             <label htmlFor="day">Day:</label>
//             <input type="text" id="day" name="day" value={day} readOnly />
//           </div>
//           <div className="form-group">
//             <label htmlFor="time">Time:</label>
//             <input type="time" id="time" name="time" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="class">Class:</label>
//             <select id="class" name="class" value={selectedClass} onChange={handleClassChange}>
//               <option value="">Select class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="periodNo">Period no:</label>
//             <input type="number" id="periodNo" name="periodNo" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="subject">Subject:</label>
//             <select id="subject" name="subject" value={selectedSubject} onChange={handleSubjectChange}>
//               <option value="">Select subject</option>
//               {subjects.map((sub, index) => (
//                 <option key={index} value={sub}>
//                   {sub}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="form-group">
//             <label htmlFor="roomNo">Room no:</label>
//             <input type="text" id="roomNo" name="roomNo" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="remark">Remark:</label>
//             <textarea id="remark" name="remark" rows="2" />
//           </div>
//           <div className="form-group">
//             <label htmlFor="totalStudents">Total Students Present:</label>
//             <input type="number" id="totalStudents" name="totalStudents" />
//           </div>
//           <div className="form-group">
//             <button type="button" className="mark-attendance-button"onClick={handleAttendanceClick}> Mark Attendance</button>
//           </div>
//           <div className="form-group full-width">
//             <button type="submit" className="save-button">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LecForm;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LecRecord.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';

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
  const [token, setToken] = useState(null);
  localStorage.setItem('token', token); // Save user data
  console.log("token saved to local storage:", token);
  const userId = localStorage.getItem('userId'); // Assuming userId is stored in local storage
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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
        console.log('Fetched classes:', response.data); // Log the data to debug
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
          console.log('Fetched subjects:', response.data); // Log the data to debug
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
    setSelectedClass(event.target.value);
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
    navigate(`/attendance-sheet/${selectedClass}`);
  };

  const handleSave = async (event) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
      const user = JSON.parse(localStorage.getItem('user')); // Assuming the user info is stored in localStorage
    event.preventDefault();

    if (!date || !day || !time || !selectedClass || !selectedSubject) {
      alert('Please fill in all required fields.');
      return;
    }

    // Proceed with the save logic
    const data = {
      userId,
      date,
      day,
      time,
      className: selectedClass,
      subject: selectedSubject,
      periodNo,
      roomNo,
      remark,
      totalStudentsPresent: totalStudents
    };

    console.log('Data to be saved:', data);
    
    try {
      const response = await axios.post('http://localhost:5000/api-v1/daily-record/add-daily-record', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert('Record saved successfully');
        // Optionally, navigate to another page or reset the form
      } else {
        alert('Failed to save the record');
      }
    } catch (error) {
      console.error('Failed to save the record:', error);
      alert('An error occurred while saving the record');
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
            <input type="number" id="periodNo" name="periodNo" value={periodNo} onChange={handlePeriodNoChange} />
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
            <input type="text" id="roomNo" name="roomNo" value={roomNo} onChange={handleRoomNoChange} />
          </div>
          <div className="form-group">
            <label htmlFor="remark">Remark:</label>
            <textarea id="remark" name="remark" rows="2" value={remark} onChange={handleRemarkChange} />
          </div>
          <div className="form-group">
            <label htmlFor="totalStudents">Total Students Present:</label>
            <input type="number" id="totalStudents" name="totalStudents" value={totalStudents} onChange={handleTotalStudentsChange} />
          </div>
          <div className="form-group">
            <button type="button" className="mark-attendance-button" onClick={handleAttendanceClick}> Mark Attendance</button>
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

