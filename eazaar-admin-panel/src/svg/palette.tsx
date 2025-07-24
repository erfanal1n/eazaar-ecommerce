import React from "react";

const Palette = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2C14.42 2 18 5.58 18 10C18 11.1 17.1 12 16 12H14.5C14.22 12 14 12.22 14 12.5C14 12.78 14.11 13.05 14.29 13.29C14.47 13.53 14.5 13.89 14.29 14.29C14.05 14.67 13.67 15 13 15C11.9 15 11 14.1 11 13V10C11 8.9 10.1 8 9 8H7C5.9 8 5 7.1 5 6C5 3.79 6.79 2 9 2H10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="10.5" r="1.5" fill="currentColor" />
    </svg>
  );
};

export default Palette;