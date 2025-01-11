

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TeacherInfoCard.css';

const TeacherInfoCard = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [formData, setFormData] = useState({}); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();


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
    const token = sessionStorage.getItem("token");
    const user = JSON.parse(sessionStorage.getItem("user"));
  
    if (!token || !user) {
      alert("Your session has expired. Please log in again.");
      sessionStorage.clear();
      navigate("/teacher-login");
      return;
    }
  
    const fetchTeacherInfo = async () => {
      try {
        const teacherId = user._id;
    
        const response = await axios.post(
          "http://localhost:5000/api-v1/auth/me",
          { user: { teacherId } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        if (response.data.success) {
          const data = response.data.user;
    
          // Function to convert mm-dd-yyyy to yyyy-mm-dd
          const convertDateToISO = (dateString) => {
            const [ day, month,year] = dateString.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          };
    
          setTeacherInfo(data);
    
          // Set form data with converted dates
          setFormData({
            ...data,
            dob: data.dob ? convertDateToISO(data.dob) : "",
            joiningdate: data.joiningdate ? convertDateToISO(data.joiningdate) : "",
          });
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.error("Error fetching teacher info:", err);
        setError("Failed to fetch teacher information");
      }
    };
    
  
    fetchTeacherInfo();
  }, [navigate]);
  
  


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
};


const handleSave = async () => {
  const token = sessionStorage.getItem("token");
  const teacherId = teacherInfo._id;

  if (!teacherId) {
    alert("Teacher ID is missing.");
    return;
  }

  const updatedFields = {};

  
  Object.keys(formData).forEach((key) => {
    if (formData[key] !== teacherInfo[key]) {
      updatedFields[key] = formData[key];
    }
  });


  if (Object.keys(updatedFields).length === 0) {
    alert("No changes made.");
    return;
  }

  try {
    const response = await axios.put(
      "http://localhost:5000/api-v1/auth/update-teacher",
      { ...updatedFields, teacherId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      setTeacherInfo((prevInfo) => ({ ...prevInfo, ...updatedFields })); 
      setIsEditing(false);
      alert("Teacher information updated successfully.");
    } else {
      alert(response.data.message || "Failed to update teacher information.");
    }
  } catch (err) {
    console.error("Error updating teacher info:", err);
    alert("An error occurred while updating teacher information.");
  }
};


  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="teacher-info-cards-container">
      {teacherInfo ? (
        <div className="teacher-info-card">
          <div className="card-content">
          {isEditing ? (
  <>
    <div className="form-row">
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          name="username"
          value={formData.username || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Contact No.:</label>
        <input
          type="text"
          name="contact"
          value={formData.contact || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>DOB:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Joining Date:</label>
        <input
          type="date"
          name="joiningdate"
          value={formData.joiningdate || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Department:</label>
        <input
          type="text"
          name="depname"
          value={formData.depname || ''}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label>Qualification:</label>
        <input
          type="text"
          name="qualification"
          value={formData.qualification || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <button className="save-btn" onClick={handleSave}>Save</button>
    <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
  </>
) : (
  <>
    <p><strong>Name:</strong> {teacherInfo.username}</p>
    <p><strong>Contact No.:</strong> {teacherInfo.contact || 'N/A'}</p>
    <p><strong>DOB:</strong> {teacherInfo.dob || 'N/A'}</p>
    <p><strong>Joining Date:</strong> {teacherInfo.joiningdate || 'N/A'}</p>
    <p><strong>Department:</strong> {teacherInfo.depname || 'N/A'}</p>
    <p><strong>Qualification:</strong> {teacherInfo.qualification || 'N/A'}</p>
    <p><strong>Email:</strong> {teacherInfo.email}</p><br/>
    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
  </>
  
)}

          </div>
        </div>
      ) : (
        <p>Loading teacher information...</p>
      )}
    </div>
  );
}

export default TeacherInfoCard;