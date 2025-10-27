import React from 'react';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`card ${hover ? 'hover:shadow-lg transition-shadow duration-200' : ''} ${className}`}>
      {children}
    </div>
  );
}
