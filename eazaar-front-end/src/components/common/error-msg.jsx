import React from "react";
import { useTheme } from "@/context/ThemeContext";

const ErrorMsg = ({ msg }) => {
  const { isDark } = useTheme();
  
  return (
    <div 
      style={{ 
        color: isDark ? "#f87171" : "#dc2626", // Light red for dark mode, darker red for light mode
        fontSize: "12px",
        fontWeight: "400",
        position: "absolute",
        top: "100%",
        left: "20px",
        marginTop: "5px",
        display: msg ? "block" : "none", // Only show when there's an error message
        zIndex: 1
      }}
    >
      {msg}
    </div>
  );
};

export default ErrorMsg;
