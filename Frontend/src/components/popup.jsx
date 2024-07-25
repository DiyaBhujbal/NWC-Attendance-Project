// Popup.jsx
import React from 'react';
import './poppup.css';

const Popup = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h3>{message}</h3>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Popup;
