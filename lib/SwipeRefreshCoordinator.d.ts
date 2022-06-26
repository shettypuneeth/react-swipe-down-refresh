declare type OnSwipeRefreshCallback = () => Promise<void>;
export interface SwipeRefreshAttributes {
    slingshotDistance?: number;
    threshold?: number;
    progressViewOffset?: number;
    progressBackgroundColor?: string;
    progressStrokeColor?: string;
    overrideBrowserRefresh?: boolean;
    onStartRefresh?: () => void;
    onEndRefresh?: () => void;
    getScrollTopOverride?: () => number;
}
export declare class SwipeRefreshCoordinator {
    private node;
    private onRefresh;
    private config;
    private spinnerRef;
    private slingshotDistance;
    private threshold;
    private progressViewOffset;
    private onStartRefresh?;
    private onEndRefresh?;
    private getScrollTopOverride?;
    constructor(element: HTMLElement, spinnerRef: HTMLElement | null, onRefresh: OnSwipeRefreshCallback, attributes?: SwipeRefreshAttributes);
    private updateProgress;
    private reset;
    private onRefreshComplete;
    private triggerRefresh;
    private getScrollTop;
    private hideSpinner;
    private handleTouchStart;
    private handleTouchMove;
    private handleTouchEnd;
    private handleTouchCancel;
    setRefreshCallback(onRefresh: () => Promise<void>): void;
    cleanup(): void;
    registerSwipeListeners(): void;
    unregisterSwipeListeners(): void;
}
export declare const getSwipeRefreshCoordinator: (element: HTMLElement, spinnerRef: HTMLElement | null, onRefresh: OnSwipeRefreshCallback, attributes?: SwipeRefreshAttributes) => SwipeRefreshCoordinator;
export {};
