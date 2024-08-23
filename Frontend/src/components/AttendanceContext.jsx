// src/components/AttendanceContext.jsx

import React, { createContext, useState, useContext } from 'react';

// Create the context
export const AttendanceContext = createContext();

// Custom hook to use the context
export const useAttendance = () => useContext(AttendanceContext);

// Provider component
export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState({});

  const value = { attendance, setAttendance };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
