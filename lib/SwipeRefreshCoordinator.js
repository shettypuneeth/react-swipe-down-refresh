const DEFAULT_THRESHOLD = 0;
const DEFAULT_SLINGSHOT_DISTANCE = 60;
const RESTING_OFFSET = -30;
const DEFAULT_PROGRESS_VIEW_OFFSET = 30;
const SCALE_DOWN_ANIMATION_DURATION = 300;
const getOpacity = (dy, max) => Math.min((0.6 / max) * dy + 0.4, 1);
const getRotation = (dy, max) => (360 / max) * dy;
const round = (value, precision = 4) => parseFloat(value.toPrecision(precision));
export class SwipeRefreshCoordinator {
    constructor(element, spinnerRef, onRefresh, attributes) {
        this.node = element;
        this.onRefresh = onRefresh;
        this.spinnerRef = spinnerRef;
        this.config = {};
        const { slingshotDistance = DEFAULT_SLINGSHOT_DISTANCE, threshold = DEFAULT_THRESHOLD, progressViewOffset = DEFAULT_PROGRESS_VIEW_OFFSET, progressBackgroundColor, progressStrokeColor, onEndRefresh, onStartRefresh, getScrollTopOverride, overrideBrowserRefresh = true, } = attributes || {};
        this.slingshotDistance = slingshotDistance;
        this.threshold = threshold;
        this.progressViewOffset = progressViewOffset;
        this.getScrollTopOverride = getScrollTopOverride;
        this.onStartRefresh = onStartRefresh;
        this.onEndRefresh = onEndRefresh;
        if (overrideBrowserRefresh) {
            document.body.style.overscrollBehaviorY = "none";
        }
        if (progressBackgroundColor) {
            document.body.style.setProperty("--sdr-progress-background", progressBackgroundColor);
        }
        if (progressStrokeColor) {
            document.body.style.setProperty("--sdr-progress-stroke", progressStrokeColor);
        }
    }
    updateProgress({ movementY, opacity, rotation = 0, scale = 1, nextFrame = true, }) {
        const updater = () => {
            if (this.spinnerRef) {
                this.spinnerRef.style.transform = `translate(-50%, ${movementY}px) rotate(${rotation}deg) scale(${scale})`;
                this.spinnerRef.style.opacity = `${opacity}`;
            }
        };
        nextFrame ? requestAnimationFrame(updater) : updater();
    }
    reset() {
        var _a;
        clearTimeout(this.config.refreshAnimationTimeout);
        this.config.state = "idle";
        this.config.movementY = 0;
        this.config.opacity = 0;
        this.config.rotation = 0;
        this.updateProgress({
            movementY: RESTING_OFFSET,
            opacity: 0,
            rotation: 0,
            nextFrame: false,
        });
        (_a = this.onEndRefresh) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    onRefreshComplete() {
        this.hideSpinner(() => this.reset());
    }
    triggerRefresh() {
        var _a;
        (_a = this.onStartRefresh) === null || _a === void 0 ? void 0 : _a.call(this);
        this.onRefresh().finally(() => {
            this.onRefreshComplete();
        });
    }
    getScrollTop() {
        var _a, _b, _c;
        return ((_b = (_a = this.getScrollTopOverride) === null || _a === void 0 ? void 0 : _a.call(this)) !== null && _b !== void 0 ? _b : (_c = document.scrollingElement) === null || _c === void 0 ? void 0 : _c.scrollTop);
    }
    hideSpinner(callback) {
        if (this.spinnerRef) {
            const { movementY, rotation } = this.config;
            this.updateProgress({
                movementY,
                rotation,
                opacity: 0,
                scale: 0.01,
                nextFrame: false,
            });
            this.config.refreshAnimationTimeout = window.setTimeout(() => {
                callback === null || callback === void 0 ? void 0 : callback();
            }, SCALE_DOWN_ANIMATION_DURATION);
        }
    }
    handleTouchStart(e) {
        const { touches } = e;
        if ((touches === null || touches === void 0 ? void 0 : touches.length) === 1 && this.config.state !== "refreshing") {
            this.config.state = "touchstart";
            this.config.startY = touches[0].clientY;
            this.config.movementY = 0;
            this.config.opacity = 0;
        }
    }
    handleTouchMove(e) {
        try {
            if (this.config.state === "refreshing" || this.config.state === "idle") {
                return;
            }
            const { touches } = e;
            const y = touches[0].clientY;
            if (this.getScrollTop() === 0 && y > this.config.startY) {
                const dy = y - this.config.startY;
                if (this.config.state === "touchstart") {
                    if (dy < this.threshold) {
                        return;
                    }
                    this.config.state = "swiping";
                }
                const movementY = dy - this.threshold;
                if (movementY <= this.slingshotDistance) {
                    this.config.movementY = movementY;
                }
                else {
                    const overshoot = movementY - this.slingshotDistance;
                    const dampedMovement = Math.pow(overshoot, 0.5);
                    this.config.movementY = this.slingshotDistance + dampedMovement;
                }
                this.config.opacity = round(getOpacity(this.config.movementY, this.slingshotDistance));
                this.config.rotation = round(getRotation(this.config.movementY, this.slingshotDistance));
                this.updateProgress({
                    movementY: this.config.movementY,
                    opacity: this.config.opacity,
                    rotation: this.config.rotation,
                });
            }
        }
        catch (e) {
            console.log("SwipeRefreshCoordinator.handleTouchMove", e.message);
        }
    }
    handleTouchEnd() {
        if (this.config.state === "swiping") {
            if (this.config.movementY >= this.slingshotDistance) {
                this.config.movementY = this.progressViewOffset;
                this.config.state = "refreshing";
                this.updateProgress({
                    movementY: this.config.movementY,
                    opacity: this.config.opacity,
                    rotation: this.config.rotation,
                });
                this.triggerRefresh();
            }
            else {
                this.reset();
            }
        }
    }
    handleTouchCancel() {
        this.reset();
    }
    setRefreshCallback(onRefresh) {
        this.onRefresh = onRefresh;
    }
    cleanup() {
        document.body.style.overscrollBehaviorY = "auto";
    }
    registerSwipeListeners() {
        if (this.node) {
            this.node.addEventListener("touchstart", this.handleTouchStart.bind(this), {
                passive: true,
            });
            this.node.addEventListener("touchmove", this.handleTouchMove.bind(this), {
                passive: false,
            });
            this.node.addEventListener("touchend", this.handleTouchEnd.bind(this), {
                passive: true,
            });
            this.node.addEventListener("touchcancel", this.handleTouchCancel.bind(this), { passive: true });
        }
    }
    unregisterSwipeListeners() {
        if (this.node) {
            this.reset();
            this.node.removeEventListener("touchstart", this.handleTouchStart.bind(this));
            this.node.removeEventListener("touchmove", this.handleTouchMove.bind(this));
            this.node.removeEventListener("touchend", this.handleTouchEnd.bind(this));
            this.node.removeEventListener("touchcancel", this.handleTouchCancel.bind(this));
        }
    }
}
export const getSwipeRefreshCoordinator = (element, spinnerRef, onRefresh, attributes) => new SwipeRefreshCoordinator(element, spinnerRef, onRefresh, attributes);
