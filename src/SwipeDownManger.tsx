import React, { useRef } from "react";
import SwipeDownSpinner from "./SwipeDownSpinner";
import { useSwipeRefresh } from "./useSwipeRefresh";

export interface SwipeDownManagerProps {
  onRefresh: () => Promise<void>;
  scrollElement: HTMLElement | null;
  disabled?: boolean;
}

export default function SwipeDownManger(props: SwipeDownManagerProps) {
  const { disabled, scrollElement, onRefresh } = props;
  const spinnerRef = useRef<HTMLDivElement>(null);

  useSwipeRefresh(scrollElement, onRefresh, spinnerRef, disabled);

  return <SwipeDownSpinner disabled={disabled} ref={spinnerRef} />;
}
