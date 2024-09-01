import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecordTable.css';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const RecordTable = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const decodeToken = (token) => {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
      `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
    return JSON.parse(jsonPayload);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!token || !user) {
      alert("Your session has expired. Please log in again.");
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
          { user: { teacherId }},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.success) {
          setDailyRecords(response.data.dailyRecords);
        } else {
          console.error('Failed to fetch daily records:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching daily records:', error);
      }
    };

    fetchDailyRecords();
  }, [navigate]);

  const handleEditClick = (record) => {
    sessionStorage.setItem('lecRecordData', JSON.stringify(record));
    sessionStorage.setItem('recordId', record._id);
    navigate('/update-daily-lec-report-form');
  };

  const handleDeleteClick = async (recordId) => {
    const confirmed = window.confirm("Are you sure you want to delete this record?");
    
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
            'Content-Type': 'application/json'
          },
          data: {
           user: { teacherId },
           recordId: recordId
          }
        }
      );

      if (response.data.success) {
        setDailyRecords((prevRecords) => prevRecords.filter((record) => record._id !== recordId));
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

  const handleClassChange = (e) => {
    setFilterClass(e.target.value);
  };

  const normalizeClassName = (className) => {
    return className.toLowerCase().replace(/[\W_]+/g, '');
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const filteredRecords = dailyRecords.filter((record) => {
    const monthMatch = filterMonth ? new Date(record.date).toISOString().slice(0, 7) === filterMonth : true;
    const classMatch = filterClass ? normalizeClassName(record.className).includes(normalizeClassName(filterClass)) : true;
    return monthMatch && classMatch;
  });

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} />
      <h2>Update Lecture Records</h2>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="filter-container">
        <input
          type="month"
          value={filterMonth}
          onChange={handleMonthChange}
          placeholder="Filter by Month"
        />
        <input
          type="text"
          value={filterClass}
          onChange={handleClassChange}
          placeholder="Filter by Class"
        />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Time</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Room No</th>
              <th>Remark</th>
              <th>Attendance Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.day}</td>
                  <td>{formatDateForInput(record.date)}</td>
                  <td>{record.time.join(', ')}</td>
                  <td>{record.className}</td>
                  <td>{record.subject}</td>
                  <td>{record.room_number}</td>
                  <td>{record.remark}</td>
                  <td>{record.attendance.length}</td>
                  <td>
                    <button className="action-btn edit-btn" onClick={() => handleEditClick(record)}>
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button className="action-btn delete-btn" onClick={() => handleDeleteClick(record._id)}>
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No records found.</td>
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
    </div>
  );
};

export default RecordTable;
