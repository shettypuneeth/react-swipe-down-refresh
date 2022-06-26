import React, { useRef } from "react";
import type { ReactNode } from "react";
import { useSwipeRefresh } from "./useSwipeRefresh";
import SwipeDownSpinner from "./SwipeDownSpinner";
import type { SwipeRefreshAttributes } from "./SwipeRefreshCoordinator";

interface SwipeRefreshListProps {
  children: ReactNode | ReactNode[];
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function SwipeRefreshList(
  props: SwipeRefreshListProps & SwipeRefreshAttributes
) {
  const {
    onRefresh,
    children,
    disabled,
    className = "",
    ...attributes
  } = props;

  const listRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const { isRefreshing } = useSwipeRefresh(
    listRef,
    spinnerRef,
    onRefresh,
    disabled,
    attributes
  );

  return (
    <div className={`sdr-list-container ${className}`} ref={listRef}>
      {children}

      <SwipeDownSpinner
        disabled={disabled}
        refreshing={isRefreshing}
        ref={spinnerRef}
      />
    </div>
  );
}
