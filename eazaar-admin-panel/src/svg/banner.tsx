import React from "react";

const Banner = () => {
  return (
    <svg
      style={{ transform: 'translateY(-4px)' }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path
        fill="currentColor"
        d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 5h14v6.5l-2.5-2.5-1.5 1.5L12 8l-3 3-2-2L5 11.5V5zm0 14v-1.5l2-2 2 2 3-3 3 2.5 1.5-1.5 2.5 2.5V19H5z"
      />
      <circle
        fill="currentColor"
        cx="8.5"
        cy="8.5"
        r="1.5"
      />
    </svg>
  );
};

export default Banner;