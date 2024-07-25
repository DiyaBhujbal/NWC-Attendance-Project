// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import "./AttendanceSheetcopy.css";

// const AttendanceSheet = () => {
//   const { classId } = useParams();
//   const [students, setStudents] = useState([]);
//   const [dates, setDates] = useState(['2023-07-01', '2023-07-02']); // Initial dates for demo
//   const [attendance, setAttendance] = useState({});

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api-v1/class/${classId}/students-list`);
//         console.log(response.data); // Log the response data to debug
//         if (response.data.success) {
//           const fetchedStudents = response.data.studentsList;
//           setStudents(fetchedStudents);
//           const initialAttendance = fetchedStudents.reduce((acc, student) => {
//             acc[student.roll_no] = dates.reduce((dateAcc, date) => {
//               dateAcc[date] = false;
//               return dateAcc;
//             }, {});
//             return acc;
//           }, {});
//           setAttendance(initialAttendance);
//         } else {
//           console.error('Failed to fetch students:', response.data.message);
//         }
//       } catch (error) {
//         console.error('Error fetching students:', error);
//       }
//     };
//     fetchStudents();
//   }, [classId, dates]);

//   useEffect(() => {
//     console.log('Students:', students);
//   }, [students]);

//   useEffect(() => {
//     console.log('Attendance:', attendance);
//   }, [attendance]);

//   const handleCheckboxChange = (rollNumber, date) => {
//     setAttendance((prevState) => ({
//       ...prevState,
//       [rollNumber]: {
//         ...prevState[rollNumber],
//         [date]: !prevState[rollNumber][date],
//       },
//     }));
//   };

//   const addDate = () => {
//     const newDate = prompt('Enter a new date (YYYY-MM-DD):');
//     if (newDate && !dates.includes(newDate)) {
//       setDates([...dates, newDate]);
//       setAttendance((prevState) => {
//         const updatedAttendance = { ...prevState };
//         Object.keys(updatedAttendance).forEach((rollNumber) => {
//           updatedAttendance[rollNumber][newDate] = false;
//         });
//         return updatedAttendance;
//       });
//     }
//   };

//   const addStudent = () => {
//     const rollNumber = prompt('Enter roll number:');
//     const name = prompt('Enter name:');
//     if (rollNumber && name) {
//       const newStudent = { roll_no: rollNumber, student_name: name };
//       setStudents([...students, newStudent]);
//       setAttendance((prevState) => ({
//         ...prevState,
//         [rollNumber]: dates.reduce((dateAcc, date) => {
//           dateAcc[date] = false;
//           return dateAcc;
//         }, {}),
//       }));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api-v1/daily-record/add-attendance-entry`, {
//         attendance,
//         dates,
//       });
//       console.log(response.data); // Log the response data to debug
//       if (response.data.success) {
//         alert('Attendance saved successfully');
//       } else {
//         console.error('Failed to save attendance:', response.data.message);
//       }
//     } catch (error) {
//       console.error('Error saving attendance:', error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={addDate}>Add Date</button>
//       <button onClick={addStudent}>Add Student</button>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Roll Number</th>
//             <th>Name</th>
//             {dates.map((date) => (
//               <th key={date}>{date}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => (
//             <tr key={student.roll_no}>
//               <td>{student.roll_no}</td>
//               <td>{student.student_name}</td>
//               {dates.map((date) => (
//                 <td key={date}>
//                   <input
//                     type="checkbox"
//                     checked={attendance[student.roll_no] ? attendance[student.roll_no][date] : false}
//                     onChange={() => handleCheckboxChange(student.roll_no, date)}
//                   />
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <button onClick={handleSave}>Save</button>
//     </div>
//   );
// };

// export default AttendanceSheet;

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

      const payload = {
        user, // Send user info in the request body
        attendance,
      };

      if (!token) {
        // Make an API call & get the JWT token using userId
        const response = (
          await axios.post(`http://localhost:5000/api-v1/token/generate`, {
            userId: user.id,
          })
        ).data;
        token = response.token;
      }

      console.log("Request Payload:", payload); // Log the payload to debug

      const response = await axios.post(
        `http://localhost:5000/api-v1/daily-record/add-attendance-entry`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Log the response data to debug
      if (response.data.success) {
        alert("Attendance saved successfully");
      } else {
        console.error("Failed to save attendance:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
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
