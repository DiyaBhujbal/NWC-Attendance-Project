import React from 'react';

const Welcome = ({ name }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-6 px-8 rounded-lg shadow-lg mb-6">
      <h1 className="text-3xl font-semibold text-shadow-md">Welcome {name}!</h1>
    </div>
  );
};

export default Welcome;
