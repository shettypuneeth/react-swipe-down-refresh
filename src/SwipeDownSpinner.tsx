import React from "react";
import ArrowClockwise from "./ArrowClockwise";

interface SwipeDownSpinnerProps {
  disabled?: boolean;
}

const SwipeDownSpinner = React.forwardRef(
  (props: SwipeDownSpinnerProps, ref?: React.ForwardedRef<HTMLDivElement>) => {
    if (props.disabled) {
      return null;
    }

    return (
      <div ref={ref} className="sdr-spinner">
        <ArrowClockwise />
      </div>
    );
  }
);

export default SwipeDownSpinner;
