import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AttendanceSheetcopy.css';

const AttendanceSheet = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Your session has expired. Please log in again.');
      sessionStorage.clear();
      navigate('/teacher-login'); // Redirect to login page
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api-v1/class/${classId}/students-list`);
        if (response.data.success) {
          const fetchedStudents = response.data.studentsList;
          setStudents(fetchedStudents);

          // Load attendance data from session storage
          const savedAttendance = JSON.parse(sessionStorage.getItem('attendance')) || {};
          const initialAttendance = savedAttendance[classId] || [];

          // Initialize attendance with existing data or default to false
          const updatedAttendance = fetchedStudents.reduce((acc, student) => {
            acc[student.roll_no] = initialAttendance.find(att => att.roll_no === student.roll_no)?.status || false;
            return acc;
          }, {});

          setAttendance(updatedAttendance);
        } else {
          console.error('Failed to fetch students:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [classId, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCheckboxChange = (rollNumber) => {
    setAttendance((prevState) => {
      const newAttendance = {
        ...prevState,
        [rollNumber]: !prevState[rollNumber],
      };
      setHasUnsavedChanges(true);

      // Update session storage
      const savedAttendance = JSON.parse(sessionStorage.getItem('attendance')) || {};
      savedAttendance[classId] = Object.keys(newAttendance).map(rollNo => ({
        roll_no: parseInt(rollNo, 10),
        status: newAttendance[rollNo],
      }));
      sessionStorage.setItem('attendance', JSON.stringify(savedAttendance));

      return newAttendance;
    });
  };

  const handleSave = () => {
    // Filter out entries where the status is true
    const formattedAttendance = Object.keys(attendance)
      .filter((rollNo) => attendance[rollNo]) // Only include entries with status true
      .map((rollNo) => ({
        roll_no: parseInt(rollNo, 10),
        status: attendance[rollNo],
      }));

    // Save the formatted attendance in session storage
    const savedAttendance = JSON.parse(sessionStorage.getItem('attendance')) || {};
    savedAttendance[classId] = formattedAttendance;
    sessionStorage.setItem('attendance', JSON.stringify(savedAttendance));

    setHasUnsavedChanges(false);

    console.log('Attendance marked!:', formattedAttendance);
    alert('Attendance marked!');
    navigate(-1); // Navigate back to the LecForm component
  };

  
  return (
    <div className="attendance-container">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name</th>
              <th>Present</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.roll_no}>
                <td>{student.roll_no}</td>
                <td>{student.student_name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance[student.roll_no] || false}
                    onChange={() => handleCheckboxChange(student.roll_no)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="save-button" onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default AttendanceSheet;
