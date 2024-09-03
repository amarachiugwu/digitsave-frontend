import React from 'react';

interface ProgressBarProps {
  value: number; // Value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  return (
    <div className="w-full relative pt-1">
      
      <div className="flex">
        <div className="w-full bg-gray-200 rounded-full">
          <div
            className="bg-secondry-4 leading-none py-1 text-center text-[10px] text-[#008080] font-bold rounded-full"
            style={{ width: `${value}%` }}
          >
            {`${value}%`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
