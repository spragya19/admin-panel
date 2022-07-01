import React from "react";
import "../styles/Spinner.css"

function Spinner() {
  return (
    <div className="spinnerr">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
