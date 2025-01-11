import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './DefaulterStudents.css';
import { CollegeLogo } from '../assets';

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
  const [percentageFilter, setPercentageFilter] = useState('');
  const navigate = useNavigate();

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

  const handleClassChange = (event) => {
    const classId = event.target.value;
    setSelectedClass(classId);

    const selectedClassObj = classes.find(cls => cls._id === classId);
    setFilters({ ...filters, className: selectedClassObj ? selectedClassObj.name : '' });
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
    setFilters({ ...filters, subject: event.target.value });
  };

  const handlePercentageChange = (event) => {
    const selectedPercentage = event.target.value;
    setPercentageFilter(selectedPercentage);
  };

  const applyFilter = () => {
    if (filters.className && filters.subject) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const userId = user ? user._id : null;
  
      if (!userId) {
        setError('User is not authenticated.');
        return;
      }
  
      // Default percentage filter to 100 if not selected
      const percentage = percentageFilter || '100';
  
      const filtersWithUserId = { ...filters, user: { userId } };
      console.log('Filters being sent to backend:', { ...filtersWithUserId, threshold: percentage });
  
      fetchDefaulters({ ...filtersWithUserId, threshold: percentage });
    } else {
      setError('Please select both class and subject.');
    }
  };
  
  const fetchDefaulters = async (filtersWithUserId) => {
    setLoading(true);
    setError('');
    try {
      const filtersWithThreshold = {
        ...filtersWithUserId,
        threshold: percentageFilter || '100', // Ensure percentage filter defaults to 100
      };
  
      console.log('Final filters being sent:', filtersWithThreshold);
  
      const { data } = await axios.post('http://localhost:5000/api-v1/daily-record/defaulters', filtersWithThreshold);
  
      if (data.success) {
        setDefaulters(data.defaulters);
        console.log('Defaulters received:', data.defaulters);
      } else {
        setError('No defaulters found or error in response.');
        setDefaulters([]);
      }
    } catch (error) {
      console.error('Error fetching defaulters:', error);
      setError('Failed to fetch defaulters. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const downloadPDF = () => {
    const element = document.getElementById('defaulter-report');
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = 285;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Defaulters-${filters.className}-${filters.subject}.pdf`);
    });
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="defaulter-container" id="defaulter-report">
        <img src={CollegeLogo} alt="College Logo" className="college-logo" />
        <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>

        <h1><strong>Defaulter Students Report</strong> <br />Class: {filters.className || 'N/A'}<br />Subject: {filters.subject || 'N/A'}</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="filters no-print">
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

          <div className="form-group">
            <label htmlFor="percentage">Attendance Percentage Filter:</label>
            <select id="percentage" value={percentageFilter} onChange={handlePercentageChange}>
              <option value="">Select</option>
              <option value="100">Less than or equal to 100</option>
              <option value="50">Less than 50</option>
              <option value="60">Less than 60</option>
              <option value="75">Less than 75</option>
            </select>
          </div>

          <button className="apply-filter-btn no-print" onClick={applyFilter}>
          Apply Filter
        </button>

        </div>


        <button className="download-btn no-print" onClick={downloadPDF}>
          Download as PDF
        </button>

        {loading && <p>Loading...</p>}
        {!loading && defaulters.length > 0 && (
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
        )}
        {!loading && defaulters.length === 0 && <p>No defaulters found for the selected filters.</p>}
      </div>
    </div>
  );
};

export default DefaulterStudents;
