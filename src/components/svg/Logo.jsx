import React from 'react';

const Logo = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#4fd1f2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00a8ec', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      {/* First Diagonal Line */}
      <rect
        x="70"
        y="30"
        width="20"
        height="120"
        transform="rotate(-45 80 90)"
        fill="url(#grad1)"
      />
      {/* Second Diagonal Line */}
      <rect
        x="110"
        y="80"
        width="20"
        height="120"
        transform="rotate(-45 120 140)"
        fill="url(#grad1)"
      />
    </svg>
  );
};

export default Logo;
