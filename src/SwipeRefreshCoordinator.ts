type OnSwipeRefreshCallback = () => Promise<void>;

interface SwipeRefreshConfig {
  initialized: boolean;
  movementY: number;
  opacity: number;
  refreshAnimationTimeout: number;
  rotation: number;
  state: "idle" | "touchstart" | "swiping" | "refreshing";
  startY: number;
}

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

// Minimum displacement before swipe is registered. This helps avoid taps being registered as swipes
const DEFAULT_THRESHOLD = 0;

// Travel distance to initiate the refresh
const DEFAULT_SLINGSHOT_DISTANCE = 60;

// Displacement when in idle state
const RESTING_OFFSET = -30;

// Displacement when refresh is in progress
const DEFAULT_PROGRESS_VIEW_OFFSET = 30;

const SCALE_DOWN_ANIMATION_DURATION = 300;

const getOpacity = (dy: number, max: number) =>
  Math.min((0.6 / max) * dy + 0.4, 1);
const getRotation = (dy: number, max: number) => (360 / max) * dy;

const round = (value: number, precision: number = 4) =>
  parseFloat(value.toPrecision(precision));

export class SwipeRefreshCoordinator {
  private node: HTMLElement;
  private onRefresh: OnSwipeRefreshCallback;
  private config: SwipeRefreshConfig;
  private spinnerRef: HTMLElement | null;
  private slingshotDistance: number;
  private threshold: number;
  private progressViewOffset: number;
  private onStartRefresh?: () => void;
  private onEndRefresh?: () => void;
  private getScrollTopOverride?: () => number;

  constructor(
    element: HTMLElement,
    spinnerRef: HTMLElement | null,
    onRefresh: OnSwipeRefreshCallback,
    attributes?: SwipeRefreshAttributes
  ) {
    this.node = element;
    this.onRefresh = onRefresh;
    this.spinnerRef = spinnerRef;
    this.config = {} as SwipeRefreshConfig;

    const {
      slingshotDistance = DEFAULT_SLINGSHOT_DISTANCE,
      threshold = DEFAULT_THRESHOLD,
      progressViewOffset = DEFAULT_PROGRESS_VIEW_OFFSET,
      progressBackgroundColor,
      progressStrokeColor,
      onEndRefresh,
      onStartRefresh,
      getScrollTopOverride,
      overrideBrowserRefresh = true,
    } = attributes || {};

    this.slingshotDistance = slingshotDistance;
    this.threshold = threshold;
    this.progressViewOffset = progressViewOffset;
    this.getScrollTopOverride = getScrollTopOverride;
    this.onStartRefresh = onStartRefresh;
    this.onEndRefresh = onEndRefresh;

    // Disable the window pull-to-refresh behavior
    if (overrideBrowserRefresh) {
      document.body.style.overscrollBehaviorY = "none";
    }

    // set color schemes
    if (progressBackgroundColor) {
      document.body.style.setProperty(
        "--sdr-progress-background",
        progressBackgroundColor
      );
    }

    if (progressStrokeColor) {
      document.body.style.setProperty(
        "--sdr-progress-stroke",
        progressStrokeColor
      );
    }
  }

  private updateProgress({
    movementY,
    opacity,
    rotation = 0,
    scale = 1,
    nextFrame = true,
  }: Pick<SwipeRefreshConfig, "movementY" | "opacity" | "rotation"> & {
    scale?: number;
    nextFrame?: boolean;
  }) {
    const updater = () => {
      if (this.spinnerRef) {
        this.spinnerRef.style.transform = `translate(-50%, ${movementY}px) rotate(${rotation}deg) scale(${scale})`;
        this.spinnerRef.style.opacity = `${opacity}`;
      }
    };

    nextFrame ? requestAnimationFrame(updater) : updater();
  }

  private reset() {
    // clear any pending animation timeouts
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

    this.onEndRefresh?.();
  }

  private onRefreshComplete() {
    this.hideSpinner(() => this.reset());
  }

  private triggerRefresh() {
    this.onStartRefresh?.();

    this.onRefresh().finally(() => {
      this.onRefreshComplete();
    });
  }

  private getScrollTop() {
    return (
      this.getScrollTopOverride?.() ?? document.scrollingElement?.scrollTop
    );
  }

  private hideSpinner(callback?: () => void) {
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
        callback?.();
      }, SCALE_DOWN_ANIMATION_DURATION);
    }
  }

  private handleTouchStart(e: TouchEvent) {
    const { touches } = e;

    if (touches?.length === 1 && this.config.state !== "refreshing") {
      this.config.state = "touchstart";
      this.config.startY = touches[0].clientY;
      this.config.movementY = 0;
      this.config.opacity = 0;
    }
  }

  private handleTouchMove(e: TouchEvent) {
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

        // Swipe has not crossed the slingshot distance or swiping up
        // update the progress using the travel distance
        if (movementY <= this.slingshotDistance) {
          this.config.movementY = movementY;
        } else {
          // Beyond slingshot distance, add delta to give rubber band effect
          const overshoot = movementY - this.slingshotDistance;
          const dampedMovement = Math.pow(overshoot, 0.5);
          this.config.movementY = this.slingshotDistance + dampedMovement;
        }

        this.config.opacity = round(
          getOpacity(this.config.movementY, this.slingshotDistance)
        );
        this.config.rotation = round(
          getRotation(this.config.movementY, this.slingshotDistance)
        );

        this.updateProgress({
          movementY: this.config.movementY,
          opacity: this.config.opacity,
          rotation: this.config.rotation,
        });
      }
    } catch (e: any) {
      console.log("SwipeRefreshCoordinator.handleTouchMove", e.message);
    }
  }

  private handleTouchEnd() {
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
      } else {
        // reset the state
        this.reset();
      }
    }
  }

  private handleTouchCancel() {
    this.reset();
  }

  public registerSwipeListeners() {
    if (this.node) {
      this.node.addEventListener(
        "touchstart",
        this.handleTouchStart.bind(this),
        {
          passive: true,
        }
      );
      this.node.addEventListener("touchmove", this.handleTouchMove.bind(this), {
        passive: false,
      });
      this.node.addEventListener("touchend", this.handleTouchEnd.bind(this), {
        passive: true,
      });
      this.node.addEventListener(
        "touchcancel",
        this.handleTouchCancel.bind(this),
        { passive: true }
      );
    }
  }

  public unregisterSwipeListeners() {
    if (this.node) {
      this.reset();
      this.node.removeEventListener(
        "touchstart",
        this.handleTouchStart.bind(this)
      );
      this.node.removeEventListener(
        "touchmove",
        this.handleTouchMove.bind(this)
      );
      this.node.removeEventListener("touchend", this.handleTouchEnd.bind(this));
      this.node.removeEventListener(
        "touchcancel",
        this.handleTouchCancel.bind(this)
      );
    }
  }
}

export const getSwipeRefreshCoordinator = (
  element: HTMLElement,
  spinnerRef: HTMLElement | null,
  onRefresh: OnSwipeRefreshCallback,
  attributes?: SwipeRefreshAttributes
) => new SwipeRefreshCoordinator(element, spinnerRef, onRefresh, attributes);
