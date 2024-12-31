// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DefaulterStudents = () => {
//     const [defaulters, setDefaulters] = useState([]);
//     const [filters, setFilters] = useState({ className: '', subject: '', date: '' });

//     const fetchDefaulters = async () => {
//         try {
//             const { data } = await axios.get('http://localhost:5000/api-v1/daily-record/defaulters', {
//                 params: filters,
//             });
//             setDefaulters(data);
//         } catch (error) {
//             console.error('Error fetching defaulters:', error);
//         }
//     };

//     useEffect(() => {
//         fetchDefaulters();
//     }, [filters]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({ ...filters, [name]: value });
//     };

//     return (
//         <div>
//             <h1>Defaulter Students</h1>

//             <div>
//                 <label>Class Name:</label>
//                 <input
//                     type="text"
//                     name="className"
//                     value={filters.className}
//                     onChange={handleInputChange}
//                 />

//                 <label>Subject:</label>
//                 <input
//                     type="text"
//                     name="subject"
//                     value={filters.subject}
//                     onChange={handleInputChange}
//                 />

//                 <label>Date:</label>
//                 <input
//                     type="date"
//                     name="date"
//                     value={filters.date}
//                     onChange={handleInputChange}
//                 />
//             </div>

//             <button onClick={fetchDefaulters}>Fetch Defaulters</button>

//             <table>
//                 <thead>
//                     <tr>
//                         <th>Roll No</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {defaulters.map((student, index) => (
//                         <tr key={index}>
//                             <td>{student.roll_no}</td>
//                             <td>{student.status ? 'Present' : 'Absent'}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DefaulterStudents;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const DefaulterStudents = () => {
//     const [defaulters, setDefaulters] = useState([]);
//     const [filters, setFilters] = useState({ className: '', subject: '', date: '' });
//     const [classes, setClasses] = useState([]);
//     const [subjects, setSubjects] = useState([]);
//     const [selectedClass, setSelectedClass] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [selectedClassName, setSelectedClassName] = useState('');
 

//     useEffect(() => {
//         const fetchClasses = async () => {
//           try {
//             const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
//             if (response.data.success && Array.isArray(response.data.classes)) {
//               setClasses(response.data.classes);
//             } else {
//               console.error('Fetched classes is not an array:', response.data);
//             }
//           } catch (error) {
//             console.error('Failed to fetch classes:', error);
//           }
//         };
//         fetchClasses();
//       }, []);
    
//       useEffect(() => {
//         const fetchSubjects = async () => {
//           if (selectedClass) {
//             try {
//               const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/subjects`);
//               if (response.data.success && Array.isArray(response.data.subjects)) {
//                 setSubjects(response.data.subjects);
//               } else {
//                 console.error('Fetched subjects is not an array:', response.data);
//               }
//             } catch (error) {
//               console.error('Failed to fetch subjects:', error);
//             }
//           }
//         };
//         fetchSubjects();
//       }, [selectedClass]);
    
    
    
    
    
//       const handleClassChange = (event) => {
//         const classId = event.target.value;
//         setSelectedClass(classId);
    
//         const selectedClassObj = classes.find(cls => cls._id === classId);
//         setSelectedClassName(selectedClassObj ? selectedClassObj.name : '');
//       };
    
//       const handleSubjectChange = (event) => {
//         setSelectedSubject(event.target.value);
//       };
    


   
//       const fetchDefaulters = async () => {
//         try {
//             console.log('Fetching defaulters with filters:', filters);
//             const { data } = await axios.get('http://localhost:5000/api-v1/daily-record/defaulters', {
//                 params: filters,
//             });
    
//             if (data.success) {
//                 console.log('Defaulters data:', data);
//                 setDefaulters(data.defaulters);
//             } else {
//                 console.error('No defaulters found or error in response:', data);
//             }
//         } catch (error) {
//             console.error('Error fetching defaulters:', error);
//         }
//     };
    

   
//     useEffect(() => {
//         if (selectedClass && selectedSubject) {
//             setFilters({
//                 ...filters,
//                 className: selectedClassName,
//                 subject: selectedSubject,
//             });
//         }
//     }, [selectedClass, selectedSubject]);
    
   
//     useEffect(() => {
//         console.log("Defaulters data:", defaulters);
//     }, [defaulters]);

    

//     useEffect(() => {
//         if (filters.className && filters.subject) {
//             fetchDefaulters(); // Fetch defaulters when filters are updated
//         }
//     }, [filters]);
    

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFilters({ ...filters, [name]: value });
//     };

//     return (
//         <div>
//             <h1>Defaulter Students</h1>

//             <div>
//             <div className="form-group">
//             <label htmlFor="class">Class:</label>
//             <select id="class" name="class" value={selectedClass} onChange={handleClassChange} required>
//               <option value="">Select class</option>
//               {classes.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>
         
//           <div className="form-group">
//             <label htmlFor="subject">Subject:</label>
//             <select id="subject" name="subject" value={selectedSubject} onChange={handleSubjectChange} required>
//               <option value="">Select subject</option>
//               {subjects.map((sub, index) => (
//                 <option key={index} value={sub}>
//                   {sub}
//                 </option>
//               ))}
//             </select>
//           </div>

//                 {/* <label>Date:</label>
//                 <input
//                     type="date"
//                     name="date"
//                     value={filters.date}
//                     onChange={handleInputChange}
//                 /> */}
//             </div>

//             <button onClick={fetchDefaulters}>Fetch Defaulters</button>

//             <table>
//                 <thead>
//                     <tr>
//                         <th>Roll No</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {defaulters.map((student, index) => (
//                         <tr key={index}>
//                             <td>{student.roll_no}</td>
//                             <td>{student.status ? 'Present' : 'Absent'}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DefaulterStudents;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './DefaulterStudents.css'; // Make sure to add appropriate styles if needed.

// const DefaulterStudents = () => {
//     const [defaulters, setDefaulters] = useState([]);
//     const [filters, setFilters] = useState({ className: '', subject: '' });
//     const [classes, setClasses] = useState([]);
//     const [subjects, setSubjects] = useState([]);
//     const [selectedClass, setSelectedClass] = useState('');
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const navigate = useNavigate();

//     // Fetch classes
//     useEffect(() => {
//         const fetchClasses = async () => {
//             try {
//                 const response = await axios.get('http://localhost:5000/api-v1/class/get-all-classes');
//                 if (response.data.success && Array.isArray(response.data.classes)) {
//                     setClasses(response.data.classes);
//                 } else {
//                     console.error('Fetched classes is not an array:', response.data);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch classes:', error);
//             }
//         };
//         fetchClasses();
//     }, []);

//     // Fetch subjects based on selected class
//     useEffect(() => {
//         const fetchSubjects = async () => {
//             if (selectedClass) {
//                 try {
//                     const response = await axios.get(`http://localhost:5000/api-v1/class/${selectedClass}/subjects`);
//                     if (response.data.success && Array.isArray(response.data.subjects)) {
//                         setSubjects(response.data.subjects);
//                     } else {
//                         console.error('Fetched subjects is not an array:', response.data);
//                     }
//                 } catch (error) {
//                     console.error('Failed to fetch subjects:', error);
//                 }
//             }
//         };
//         fetchSubjects();
//     }, [selectedClass]);

//     // Handle changes to class selection
//     const handleClassChange = (event) => {
//         const classId = event.target.value;
//         setSelectedClass(classId);

//         const selectedClassObj = classes.find(cls => cls._id === classId);
//         setFilters({ ...filters, className: selectedClassObj ? selectedClassObj.name : '' });
//     };

//     // Handle changes to subject selection
//     const handleSubjectChange = (event) => {
//         setSelectedSubject(event.target.value);
//     };

//     // Fetch defaulters when filters change
//     useEffect(() => {
//         if (filters.className && filters.subject) {
//             console.log('Fetching defaulters with filters:', filters);
//             fetchDefaulters(); // Fetch defaulters when filters are updated
//         }
//     }, [filters]);

//     const fetchDefaulters = async () => {
//         try {
//             const { data } = await axios.get('http://localhost:5000/api-v1/daily-record/defaulters', {
//                 params: filters,
//             });

//             console.log('Defaulters fetched:', data); // Log the response to see if it returns the expected structure

//             if (data.success) {
//                 setDefaulters(data.defaulters);
//             } else {
//                 console.error('No defaulters found or error in response:', data);
//             }
//         } catch (error) {
//             console.error('Error fetching defaulters:', error);
//         }
//     };

//     return (
//         <div className="defaulter-container">
//             <h1>Defaulter Students</h1>

//             <div className="filters">
//                 <div className="form-group">
//                     <label htmlFor="class">Class:</label>
//                     <select id="class" name="class" value={selectedClass} onChange={handleClassChange} required>
//                         <option value="">Select class</option>
//                         {classes.map((cls) => (
//                             <option key={cls._id} value={cls._id}>
//                                 {cls.name}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="subject">Subject:</label>
//                     <select id="subject" name="subject" value={selectedSubject} onChange={handleSubjectChange} required>
//                         <option value="">Select subject</option>
//                         {subjects.map((sub, index) => (
//                             <option key={index} value={sub}>
//                                 {sub}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <button onClick={fetchDefaulters}>Fetch Defaulters</button>

//             <table>
//                 <thead>
//                     <tr>
//                         <th>Roll No</th>
//                         <th>Name</th>
//                         <th>Attendance Percentage</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {defaulters.map((student, index) => (
//                         <tr key={index}>
//                             <td>{student.roll_no}</td>
//                             <td>{student.name}</td>
//                             <td>{student.attendancePercentage}%</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default DefaulterStudents;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './DefaulterStudents.css'; // Ensure this has appropriate styles for better presentation

const DefaulterStudents = () => {
const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [defaulters, setDefaulters] = useState([]);
  const [filters, setFilters] = useState({ className: '', subject: '', userId: '' });
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch classes
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
        setError('Failed to load classes. Please try again later.');
      }
    };
    fetchClasses();
  }, []);

  // Fetch subjects based on selected class
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
          setError('Failed to load subjects. Please try again later.');
        }
      }
    };
    fetchSubjects();
  }, [selectedClass]);

  // Handle changes to class selection
  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);

    const selectedClassObj = classes.find(cls => cls._id === classId);
    setFilters({ ...filters, className: selectedClassObj ? selectedClassObj.name : '' });
  };

  // Handle changes to subject selection
  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setFilters({ ...filters, subject: event.target.value });
  };

  // Fetch defaulters when filters change
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user ? user._id : null;

    if (!userId) {
      setError('User is not authenticated.');
      setLoading(false);
      return;
    }

    if (filters.className && filters.subject) {
      const filtersWithUserId = { ...filters, user:{userId} };
      fetchDefaulters(filtersWithUserId);
    }
  }, [filters]);

  // Fetch defaulters logic
  const fetchDefaulters = async (filtersWithUserId) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api-v1/daily-record/defaulters', filtersWithUserId);

      if (data.success) {
        setDefaulters(data.defaulters);
      } else {
        setError('No defaulters found or error in response.');
        setDefaulters([]);
      }
    } catch (error) {
      setError('Failed to fetch defaulters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };


  return (
    <div>
    <Navbar toggleSidebar={toggleSidebar} />
    <h2>Defaulter Students</h2>
    <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <div className="defaulter-container">
        
      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <div className="form-group">
          <label htmlFor="class">Class:</label>
          <select id="class" value={selectedClass} onChange={handleClassChange}>
            <option value="">Select class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <select id="subject" value={selectedSubject} onChange={handleSubjectChange}>
            <option value="">Select subject</option>
            {subjects.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : defaulters.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {defaulters.map((student, index) => (
              <tr key={index}>
                <td>{student.roll_no}</td>
                <td>{student.student_name}</td>
                <td>{student.attendancePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No defaulters found for the selected filters.</p>
      )}
    </div></div>
  );
};

export default DefaulterStudents;
