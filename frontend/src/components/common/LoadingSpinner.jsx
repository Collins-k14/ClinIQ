import React from 'react';

export default function LoadingSpinner({ size = 'md', fullScreen = false }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizes[size]}`}></div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }
  
  return <div className="flex justify-center items-center">{spinner}</div>;
}