import { getSwipeRefreshCoordinator } from "./SwipeRefreshCoordinator";
import { useEffect, useRef } from "react";
import type { SwipeRefreshCoordinator } from "./SwipeRefreshCoordinator";

/**
 * The useSwipeRefresh should be used whenever the user can refresh the contents of a
 * view via a vertical swipe gesture.
 * @param element
 */
export const useSwipeRefresh = (
  element: HTMLElement,
  onRefresh: () => Promise<any>,
  spinnerRef: React.RefObject<HTMLDivElement>,
  disabled?: boolean
) => {
  const swipeRefreshCoordinator = useRef<SwipeRefreshCoordinator>(null);

  const initialize = (node: HTMLElement) => {
    try {
      swipeRefreshCoordinator.current = getSwipeRefreshCoordinator(
        node,
        onRefresh,
        spinnerRef.current
      );

      swipeRefreshCoordinator.current.registerSwipeListeners();
    } catch (error) {}
  };

  useEffect(() => {
    const node = element;
    const enableSwipeRefresh = !disabled && node;

    if (!enableSwipeRefresh) {
      return () => {};
    }

    if (!swipeRefreshCoordinator.current) {
      initialize(node);
    }

    return () => {
      swipeRefreshCoordinator.current?.unregisterSwipeListeners();
    };
  }, [element]);
};
