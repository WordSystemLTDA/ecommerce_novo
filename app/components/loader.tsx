import React from 'react';

const Loader = ({ size = 'large' }: { size?: 'small' | 'large' }) => {
  if (size === 'small') {
    return (
      <div className="flex justify-center items-center">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      {/* <p>Loading...</p> */}
    </div>
  );
};

export default Loader;