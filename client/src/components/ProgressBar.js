import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ percent }) => {
  return (
    <div className="progress-bar">
      <div style={{ width: `${percent || 0}%` }}>{percent}%</div>
    </div>
  );
};

export default ProgressBar;
