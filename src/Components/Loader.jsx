import React from "react";
import loadingWage from "../assets/gif/giphy.gif";

export default function Loader() {
  return (
    <div>
      <div className="loading-container">
        <img className="loading-gif" src={loadingWage} alt="Loading GIF" />
        <div className="loading-text">Calculating Wage...</div>
      </div>
    </div>
  );
}
