import React from 'react';

const TeacherInfoCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <i className="fas fa-user text-4xl text-gray-500"></i>
        </div>
        <div className="ml-6">
          <h2 className="text-xl font-bold">Name : Diya Bhujbal</h2>
          <p className="text-gray-700">Teacher Id: 0010</p>
          <p className="text-gray-700">Joining Date: 16/07/2024</p>
        </div>
        <div className="ml-auto">
          <p className="text-gray-700">Email-Id: example@gmail.com</p>
          <p className="text-gray-700">Contact no: xxxx xxxx xx</p>
          <p className="text-gray-700">Position: Assistant Teacher</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherInfoCard;
