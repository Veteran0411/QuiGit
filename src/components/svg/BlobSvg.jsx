import React from 'react';

const BlobSvg = () => {
    return (
        <>
        <svg
      id="sw-js-blob-svg"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
          <stop id="stop1" stopColor="rgba(179, 35, 242, 1)" offset="0%" />
          <stop id="stop2" stopColor="rgba(119, 118, 255, 1)" offset="100%" />
        </linearGradient>
      </defs>
      <path
        fill="url(#sw-gradient)"
        d="M-1.6,4.7C-6.9,8.1,-19.1,13.1,-20,12.2C-20.9,11.4,-10.5,4.6,-4.3,2.1C1.8,-0.4,3.6,1.4,-1.6,4.7Z"
        width="100%"
        height="100%"
        transform="translate(50 50)"
        strokeWidth="0"
        style={{ transition: '0.3s' }}
      />
    </svg>
  
        </>
    );
};

export default BlobSvg;
