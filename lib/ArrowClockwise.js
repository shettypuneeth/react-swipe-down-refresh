import React from "react";
export default function ArrowClockwise(props) {
    const classes = ["sdr-circularArrowStyle", props.class].join(" ");
    return (React.createElement("svg", Object.assign({ className: classes }, props, { viewBox: "0 0 16 16", xmlns: "http://www.w3.org/2000/svg" }),
        React.createElement("path", { d: "M3 8a5 5 0 019-3h-2a.5.5 0 000 1h3a.5.5 0 00.5-.5v-3a.5.5 0 00-1 0v1.53A5.99 5.99 0 002 8a6 6 0 0012 0 .5.5 0 00-1 0A5 5 0 013 8z" })));
}
