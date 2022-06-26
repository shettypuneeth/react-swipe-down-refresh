import { getSwipeRefreshCoordinator } from "./SwipeRefreshCoordinator";
import { useEffect, useRef, useState } from "react";
import type {
  SwipeRefreshCoordinator,
  SwipeRefreshAttributes,
} from "./SwipeRefreshCoordinator";

/**
 * The useSwipeRefresh should be used whenever the user can refresh the contents of a
 * view via a vertical swipe gesture.
 * @param scrollElementRef
 * @param spinnerRef
 * @param onRefresh
 * @param disabled
 * @param attributes
 * @returns
 */
export const useSwipeRefresh = (
  scrollElementRef: React.RefObject<HTMLDivElement>,
  spinnerRef: React.RefObject<HTMLDivElement>,
  onRefresh: () => Promise<any>,
  disabled?: boolean,
  attributes: SwipeRefreshAttributes = {}
) => {
  const swipeRefreshCoordinator = useRef<SwipeRefreshCoordinator | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const initialize = (node: HTMLElement) => {
    try {
      swipeRefreshCoordinator.current = getSwipeRefreshCoordinator(
        node,
        spinnerRef.current,
        onRefresh,
        {
          ...attributes,
          onStartRefresh: () => {
            setIsRefreshing(true);
            attributes.onStartRefresh?.();
          },
          onEndRefresh: () => {
            setIsRefreshing(false);
            attributes.onEndRefresh?.();
          },
        }
      );

      swipeRefreshCoordinator.current.registerSwipeListeners();
    } catch (error) {}
  };

  // Update the refresh handler
  useEffect(() => {
    swipeRefreshCoordinator.current?.setRefreshCallback(onRefresh);
  }, [onRefresh]);

  useEffect(() => {
    const node = scrollElementRef.current;
    const enableSwipeRefresh = !disabled && node !== null;

    if (!enableSwipeRefresh) {
      return () => {};
    }

    if (!swipeRefreshCoordinator.current) {
      initialize(node);
    }

    return () => {
      swipeRefreshCoordinator.current?.unregisterSwipeListeners();
    };
  }, [disabled]);

  // Cleanup operations on unmount
  useEffect(() => {
    return () => {
      swipeRefreshCoordinator.current?.cleanup();
    };
  }, []);

  return { isRefreshing };
};
