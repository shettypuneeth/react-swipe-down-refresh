var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useRef } from "react";
import { useSwipeRefresh } from "./useSwipeRefresh";
import SwipeDownSpinner from "./SwipeDownSpinner";
export default function SwipeRefreshList(props) {
    const { onRefresh, children, disabled, className = "" } = props, attributes = __rest(props, ["onRefresh", "children", "disabled", "className"]);
    const listRef = useRef(null);
    const spinnerRef = useRef(null);
    const { isRefreshing } = useSwipeRefresh(listRef, spinnerRef, onRefresh, disabled, attributes);
    return (React.createElement("div", { className: `sdr-list-container ${className}`, ref: listRef },
        children,
        React.createElement(SwipeDownSpinner, { disabled: disabled, refreshing: isRefreshing, ref: spinnerRef })));
}
