import { getSwipeRefreshCoordinator } from "./SwipeRefreshCoordinator";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SwipeRefreshCoordinator } from "./SwipeRefreshCoordinator";

/**
 * The useSwipeRefresh should be used whenever the user can refresh the contents of a
 * view via a vertical swipe gesture.
 * @param element scrollable element
 * @param onRefresh callback function to be triggered on refresh
 * @param spinnerRef spinner element
 * @param disabled disable swipe-refresh
 * @param overrideBrowserRefresh Disable the browser default pull-to-refresh behavior
 */
export const useSwipeRefresh = (
  scrollElementRef: React.RefObject<HTMLDivElement>,
  spinnerRef: React.RefObject<HTMLDivElement>,
  onRefresh: () => Promise<any>,
  getScrollTop?: () => number,
  disabled?: boolean,
  overrideBrowserRefresh: boolean = true
) => {
  const swipeRefreshCoordinator = useRef<SwipeRefreshCoordinator | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialize = (node: HTMLElement) => {
    try {
      swipeRefreshCoordinator.current = getSwipeRefreshCoordinator(
        node,
        onRefresh,
        spinnerRef.current,
        () => setIsRefreshing(true),
        () => setIsRefreshing(false),
        getScrollTop
      );

      swipeRefreshCoordinator.current.registerSwipeListeners();
    } catch (error) {}
  };

  // Disable the window pull-to-refresh behavior
  useLayoutEffect(() => {
    if (overrideBrowserRefresh) {
      document.body.style.overscrollBehaviorY = "contain";
    }
  }, []);

  useEffect(() => {
    const node = scrollElementRef.current;
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
  }, [scrollElementRef.current]);

  return { isRefreshing };
};
