import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-slate-800"></div>
    </div>
  );
};

export default Loader;