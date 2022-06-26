import React from "react";
export default function MaterialSpinner() {
    return (React.createElement("div", { className: "sdr-material-spinner-container" },
        React.createElement("svg", { className: "sdr-material-spinner", viewBox: "25 25 50 50" },
            React.createElement("circle", { className: "sdr-path", cx: "50", cy: "50", r: "18", fill: "none", strokeWidth: "3", strokeMiterlimit: "10" }))));
}
