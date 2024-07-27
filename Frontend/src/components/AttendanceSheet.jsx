import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AttendanceSheetcopy.css";

const AttendanceSheet = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { selectedClass } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api-v1/class/${classId}/students-list`);
        if (response.data.success) {
          const fetchedStudents = response.data.studentsList;
          setStudents(fetchedStudents);
          const initialAttendance = fetchedStudents.reduce((acc, student) => {
            acc[student.roll_no] = false;
            return acc;
          }, {});
          setAttendance(initialAttendance);
          const savedAttendance = JSON.parse(sessionStorage.getItem("attendance")) || {};
          savedAttendance[selectedClass] = initialAttendance;
          sessionStorage.setItem("attendance", JSON.stringify(savedAttendance));
        } else {
          console.error("Failed to fetch students:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [classId, selectedClass]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCheckboxChange = (rollNumber) => {
    setAttendance((prevState) => {
      const newAttendance = {
        ...prevState,
        [rollNumber]: !prevState[rollNumber],
      };
      setHasUnsavedChanges(true);
      const savedAttendance = JSON.parse(sessionStorage.getItem("attendance")) || {};
      savedAttendance[selectedClass] = newAttendance;
      sessionStorage.setItem("attendance", JSON.stringify(savedAttendance));
      return newAttendance;
    });
  };

  const handleSave = () => {
    const formattedAttendance = Object.keys(attendance)
      .filter((rollNo) => attendance[rollNo]) // Only include entries with status true
      .map((rollNo) => ({
        roll_no: parseInt(rollNo, 10),
        status: attendance[rollNo],
      }));

    const savedAttendance = JSON.parse(sessionStorage.getItem("attendance")) || {};
    savedAttendance[selectedClass] = formattedAttendance;
    sessionStorage.setItem("attendance", JSON.stringify(savedAttendance));
    setHasUnsavedChanges(false);
    alert("Attendance saved temporarily.");
    navigate(-1); // Navigate back to the LecForm component
  };

  const handleNavigateAway = (path) => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
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
