import React from "react";

const Moon = ({ className = "", ...props }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M17 10.09C16.1 10.59 15.1 10.87 14.08 10.87C10.95 10.87 8.41 8.33 8.41 5.2C8.41 4.18 8.69 3.18 9.19 2.28C5.43 2.86 2.5 6.13 2.5 10.07C2.5 14.52 6.07 18.09 10.52 18.09C14.46 18.09 17.73 15.16 18.31 11.4C17.91 10.74 17.46 10.36 17 10.09Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="moon-path"
      />
    </svg>
  );
};

export default Moon;