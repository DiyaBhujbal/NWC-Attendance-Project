
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AttendanceSheetcopy.css";

const AttendanceSheet = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api-v1/class/${classId}/students-list`
        );
        console.log(response.data); // Log the response data to debug
        if (response.data.success) {
          const fetchedStudents = response.data.studentsList;
          setStudents(fetchedStudents);
          const initialAttendance = fetchedStudents.reduce((acc, student) => {
            acc[student.roll_no] = false; // Initialize with false
            return acc;
          }, {});
          setAttendance(initialAttendance);
        } else {
          console.error("Failed to fetch students:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [classId]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ""; // This is needed for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleCheckboxChange = (rollNumber) => {
    setAttendance((prevState) => {
      const newAttendance = {
        ...prevState,
        [rollNumber]: !prevState[rollNumber], // Toggle attendance status
      };
      setHasUnsavedChanges(true); // Set flag to true when changes are made
      return newAttendance;
    });
  };

  const handleSave = async () => {
    try {
      let token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
      const user = JSON.parse(localStorage.getItem("user")); // Assuming the user info is stored in localStorage
      const teacherId = localStorage.getItem("teacherId");

      if (!user) {
        console.error("User not found in localStorage");
        return;
      }
  
      if (!teacherId) {
        console.error("teacherId not found in localStorage");
        return;
      }
  
      console.log("Retrieved user:", user);
      console.log("Retrieved teacherId:", teacherId);
  
    
      const payload = {
        user:{  teacherId }, // Send user info in the request body
        attendanceEntry:attendance,
      };
      console.log("no token",token);
      // if (!token) {
        console.log("inside if",token);
        // Make an API call & get the JWT token using userId
        const response1 = (
          await axios.post(`http://localhost:5000/api-v1/token/generate`, {
            teacherId: user._id,
          })
        ).data;
        token = response1.token;
      // }
     
      console.log("Request Payload:", payload); // Log the payload to debug
console.log("response 1",response1)
console.log("new no token",token);
console.log("Request Headers:", {
  Authorization: `Bearer ${token}`,
});
// console.log("id",userId);

     const response = await axios.post(
        `http://localhost:5000/api-v1/daily-record/add-attendance-entry`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response Data:",response.data); // Log the response data to debug
      if (response.data.success) {
        alert("Attendance saved successfully");
      } else {
        console.error("Failed to save attendance:", response.data.message);
      }
    } catch (error) {
  //     console.error("Error saving attendance:", error);
  //   }
  // };
  if (error.response) {
    console.error("Error Response Data:", error.response.data);
    console .error("Error Response Status:", error.response.status);
    console.error("Error Response Headers:", error.response.headers);
  } else {
    console.error("Error Message:", error.message);
  }
}
};

  const handleNavigateAway = (path) => {
    if (hasUnsavedChanges) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
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