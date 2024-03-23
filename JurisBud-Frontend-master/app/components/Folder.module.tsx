// TagDisplay.js or TagDisplay.tsx if you're using TypeScript
import React from "react";

const FolderDisplay = ({ text, date, color = "#FF0000" }) => {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "8px 12px",
    borderRadius: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    marginBottom: "8px",
  };

  const dotStyle = {
    height: "10px",
    width: "10px",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: "8px",
    backgroundColor: color, // Dynamic color based on props
  };

  const textStyle = {
    fontSize: "14px",
    color: "#333",
    marginRight: "auto",
  };

  const dateStyle = {
    fontSize: "12px",
    color: "#666",
  };

  return (
    <div style={containerStyle}>
      <span style={dotStyle}></span>
      <span style={textStyle}>{text}</span>
      <span style={dateStyle}>{date}</span>
    </div>
  );
};

export default FolderDisplay;
