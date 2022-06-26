import React from "react";
import ArrowClockwise from "./ArrowClockwise";
import MaterialSpinner from "./MaterialSpinner";
const SwipeDownSpinner = React.forwardRef((props, ref) => {
    const { refreshing, disabled } = props;
    if (disabled) {
        return null;
    }
    return (React.createElement("div", { ref: ref, className: "sdr-spinner" }, refreshing ? React.createElement(MaterialSpinner, null) : React.createElement(ArrowClockwise, null)));
});
export default SwipeDownSpinner;
