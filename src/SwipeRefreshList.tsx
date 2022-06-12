import React, { useRef } from "react";
import type { ReactNode } from "react";
import { useSwipeRefresh } from "./useSwipeRefresh";
import SwipeDownSpinner from "./SwipeDownSpinner";

interface SwipeRefreshListProps {
  children: ReactNode | ReactNode[];
  onRefresh: () => Promise<void>;
  getScrollTop?: () => number;
  disabled?: boolean;
}

export default function SwipeRefreshList(props: SwipeRefreshListProps) {
  const { onRefresh, children, getScrollTop, disabled } = props;

  const listRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  const { isRefreshing } = useSwipeRefresh(
    listRef,
    spinnerRef,
    onRefresh,
    getScrollTop,
    disabled
  );

  return (
    <div className="sdr-list-container" ref={listRef}>
      {children}

      <SwipeDownSpinner
        disabled={disabled}
        refreshing={isRefreshing}
        ref={spinnerRef}
      />
    </div>
  );
}
