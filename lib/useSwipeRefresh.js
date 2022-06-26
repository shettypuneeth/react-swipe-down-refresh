import { getSwipeRefreshCoordinator } from "./SwipeRefreshCoordinator";
import { useEffect, useRef, useState } from "react";
export const useSwipeRefresh = (scrollElementRef, spinnerRef, onRefresh, disabled, attributes = {}) => {
    const swipeRefreshCoordinator = useRef(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const initialize = (node) => {
        try {
            swipeRefreshCoordinator.current = getSwipeRefreshCoordinator(node, spinnerRef.current, onRefresh, Object.assign(Object.assign({}, attributes), { onStartRefresh: () => {
                    var _a;
                    setIsRefreshing(true);
                    (_a = attributes.onStartRefresh) === null || _a === void 0 ? void 0 : _a.call(attributes);
                }, onEndRefresh: () => {
                    var _a;
                    setIsRefreshing(false);
                    (_a = attributes.onEndRefresh) === null || _a === void 0 ? void 0 : _a.call(attributes);
                } }));
            swipeRefreshCoordinator.current.registerSwipeListeners();
        }
        catch (error) { }
    };
    useEffect(() => {
        var _a;
        (_a = swipeRefreshCoordinator.current) === null || _a === void 0 ? void 0 : _a.setRefreshCallback(onRefresh);
    }, [onRefresh]);
    useEffect(() => {
        const node = scrollElementRef.current;
        const enableSwipeRefresh = !disabled && node !== null;
        if (!enableSwipeRefresh) {
            return () => { };
        }
        if (!swipeRefreshCoordinator.current) {
            initialize(node);
        }
        return () => {
            var _a;
            (_a = swipeRefreshCoordinator.current) === null || _a === void 0 ? void 0 : _a.unregisterSwipeListeners();
        };
    }, [disabled]);
    useEffect(() => {
        return () => {
            var _a;
            (_a = swipeRefreshCoordinator.current) === null || _a === void 0 ? void 0 : _a.cleanup();
        };
    }, []);
    return { isRefreshing };
};
