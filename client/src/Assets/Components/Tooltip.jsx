import React from 'react';

const Tooltip = ({ text, classes, children }) => {
  return (
    <div
      className={`tooltip hidden group-hover:block absolute w-max left-[103%] bottom-1 text-xs p-1  bg-[rgba(0,0,0,.7)] ${classes}`}
    >
      {text || 'Tooltip'}
      {children}
    </div>
  );
};

export default Tooltip;
