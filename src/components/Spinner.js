import React from "react";
import "../styles/Spinner.css"

function Spinner() {
  return (
    <div className="spinnerr">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Spinner;
