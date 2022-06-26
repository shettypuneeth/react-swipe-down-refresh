import React from "react";

/**
 * MaterialUI loader
 * Credits: https://codepen.io/jczimm/pen/vEBpoL
 * @returns
 */
export default function MaterialSpinner() {
  return (
    <div className="sdr-material-spinner-container">
      <svg className="sdr-material-spinner" viewBox="25 25 50 50">
        <circle
          className="sdr-path"
          cx="50"
          cy="50"
          r="18"
          fill="none"
          strokeWidth="3"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  );
}
