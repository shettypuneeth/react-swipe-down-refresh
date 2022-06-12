import React from "react";
import ArrowClockwise from "./ArrowClockwise";
import MaterialSpinner from "./MaterialSpinner";

interface SwipeDownSpinnerProps {
  refreshing: boolean;
  disabled?: boolean;
}

const SwipeDownSpinner = React.forwardRef(
  (props: SwipeDownSpinnerProps, ref?: React.ForwardedRef<HTMLDivElement>) => {
    const { refreshing, disabled } = props;
    if (disabled) {
      return null;
    }

    return (
      <div ref={ref} className="sdr-spinner">
        {refreshing ? <MaterialSpinner /> : <ArrowClockwise />}
      </div>
    );
  }
);

export default SwipeDownSpinner;
