import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecordTable.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CollegeLogo } from '../assets';

const RecordTable = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterAcademicYear, setFilterAcademicYear] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 25;
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const decodeToken = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!token || !user) {
      alert('Your session has expired. Please log in again.');
      sessionStorage.clear();
      navigate('/teacher-login');
      return;
    }

    const fetchDailyRecords = async () => {
      try {
        const decodedToken = decodeToken(token);
        const teacherId = user._id;

        const response = await axios.post(
          'http://localhost:5000/api-v1/daily-record/get-daily-records',
          { user: { teacherId } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.success) {
          setDailyRecords(response.data.dailyRecords);

          // Extract unique academic years
          const years = Array.from(
            new Set(response.data.dailyRecords.map((record) => record.academicyear))
          ).sort();
          setAcademicYears(years);
        } else {
          console.error('Failed to fetch daily records:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching daily records:', error);
      }
    };

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

    fetchDailyRecords();
    fetchClasses();
  }, [navigate]);

  const handleEditClick = (record) => {
    sessionStorage.setItem('lecRecordData', JSON.stringify(record));
    sessionStorage.setItem('recordId', record._id);
    navigate('/update-daily-lec-report-form');
  };

  const handleDeleteClick = async (recordId) => {
    const confirmed = window.confirm('Are you sure you want to delete this record?');

    if (!confirmed) {
      return;
    }
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    const teacherId = user._id;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api-v1/daily-record/delete-daily-record/${recordId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
            user: { teacherId },
            recordId: recordId,
          },
        }
      );

      if (response.data.success) {
        setDailyRecords((prevRecords) =>
          prevRecords.filter((record) => record._id !== recordId)
        );
        alert('Record deleted successfully');
      } else {
        console.error('Failed to delete record:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const handleMonthChange = (e) => {
    setFilterMonth(e.target.value);
  };

  const handleAcademicYearChange = (e) => {
    setFilterAcademicYear(e.target.value);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleClassChange = (e) => {
    setFilterClass(e.target.value);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const filteredRecords = dailyRecords
    .slice()
    .reverse()
    .filter((record) => {
      const monthMatch = filterMonth
        ? new Date(record.date).toISOString().slice(0, 7) === filterMonth
        : true;
      const academicYearMatch = filterAcademicYear
        ? record.academicyear === filterAcademicYear
        : true;
      const dateMatch = filterDate
        ? formatDateForInput(record.date) === filterDate
        : true;
      const classMatch = filterClass ? record.className === filterClass : true;

      return monthMatch && academicYearMatch && dateMatch && classMatch;
    });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

 

// Function to download the table as a PDF
const downloadPDF = () => {
  const content = document.getElementById('lec-report');  

  html2canvas(content).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');  
    const pdf = new jsPDF();
    const imgWidth = 190;
    const pageHeight = 285;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add image data to the PDF
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('Lecture_Records.pdf');  // Save the generated PDF
  });
};


// Helper function to generate the filters text
const generateFilterText = () => {
  let filterText = '';
  if (filterAcademicYear) filterText += `Academic Year: ${filterAcademicYear}\n`;
  if (filterMonth) filterText += `Month: ${filterMonth}\n`;
  if (filterDate) filterText += `Date: ${filterDate}\n`;
  if (filterClass) filterText += `Class: ${filterClass}\n`;
  return filterText;
};




  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="lec-container" id="lec-report">
              <img src={CollegeLogo} alt="College Logo" className="college-logo" />
              <h3>Modern Education Society’s Nowrosjee Wadia College, Pune</h3>
      
              <h3><strong>Lecture Report</strong></h3>
      



      <div className="filter-container">
        <select value={filterAcademicYear} onChange={handleAcademicYearChange}>
          <option value="">All Academic Years</option>
          {academicYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <input
          type="month"
          value={filterMonth}
          onChange={handleMonthChange}
          placeholder="Filter by Month"
        />
        <input
          type="date"
          value={filterDate}
          onChange={handleDateChange}
          placeholder="Filter by Date"
        />
        <select value={filterClass} onChange={handleClassChange}>
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.name}>
              {cls.name}
            </option>
          ))}
        </select>
        <button onClick={downloadPDF}>Download as PDF</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Academic Year</th>
              <th>Day</th>
              <th>Date</th>
              <th>Time</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Room No</th>
              <th>Remark</th>
              <th>Note</th>
              <th>Attendance Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.id}</td>
                  <td>{record.academicyear}</td>
                  <td>{record.day}</td>
                  <td>{formatDateForInput(record.date)}</td>
                  <td>{record.time.join(', ')}</td>
                  <td>{record.className}</td>
                  <td>{record.subject}</td>
                  <td>{record.room_number}</td>
                  <td>{record.remark}</td>
                  <td>{record.note}</td>
                  <td>{record.attendance.length}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditClick(record)}
                    >
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(record._id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="page-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          « First
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="page-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last »
        </button>
      </div>
    </div></div>
  );
};

export default RecordTable;
