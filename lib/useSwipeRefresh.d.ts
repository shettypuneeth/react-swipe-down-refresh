import type { SwipeRefreshAttributes } from "./SwipeRefreshCoordinator";
export declare const useSwipeRefresh: (scrollElementRef: React.RefObject<HTMLDivElement>, spinnerRef: React.RefObject<HTMLDivElement>, onRefresh: () => Promise<any>, disabled?: boolean, attributes?: SwipeRefreshAttributes) => {
    isRefreshing: boolean;
};
