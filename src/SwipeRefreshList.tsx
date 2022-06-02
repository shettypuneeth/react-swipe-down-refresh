import React, { useRef } from "react";
import type { ReactNode } from "react";
import SwipeDownManger from "./SwipeDownManger";

interface SwipeRefreshListProps {
  children: ReactNode[];
  onRefresh: () => Promise<void>;
}

export default function SwipeRefreshList(props: SwipeRefreshListProps) {
  const { onRefresh, children } = props;
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={listRef}>
      {children}

      <SwipeDownManger scrollElement={listRef.current} onRefresh={onRefresh} />
    </div>
  );
}
