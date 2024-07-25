import React from 'react';

const Welcome = ({ name }) => {
  return (
    <div className="w-1/2 mx-auto bg-blue-600 text-white text-center py-4 rounded-lg mb-4">
      <h1 className="text-2xl">Welcome {name}!</h1>
    </div>
  );
};

export default Welcome;
