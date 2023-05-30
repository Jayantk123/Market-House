import React from "react";
import loading from "../assets/gif/loading.gif";
import load from "../assets/gif/load.gif";

export default function Spinner() {
  return (
    // <div className="loaadingSpinnerContainer">
    //     <div className="loadingSpinner">

    //     </div>
    // </div>
    <div>
      <div className="loading-container">
        <img className="loading-gif" src={load} alt="Loading GIF" />
      </div>
    </div>
  );
}
