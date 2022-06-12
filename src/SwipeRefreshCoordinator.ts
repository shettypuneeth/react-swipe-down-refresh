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

// Minimum displacement before swipe is registered. This helps avoid taps being registered as swipes
const THRESHOLD = 15;

// Travel distance to initiate the refresh
const SLINGSHOT_DISTANCE = 75;

// Displacement when in idle state
const RESTING_OFFSET = -30;

// Displacement when refresh is in progress
const REFRESHING_OFFSET = 50;

const ANIMATION_DURATION = 300;

const getOpacity = (dy: number) => (0.6 / SLINGSHOT_DISTANCE) * dy + 0.4;
const getRotation = (dy: number) => (360 / SLINGSHOT_DISTANCE) * dy;

const round = (value: number, precision: number = 4) =>
  parseFloat(value.toPrecision(precision));

export class SwipeRefreshCoordinator {
  private node: HTMLElement;
  private onRefresh: OnSwipeRefreshCallback;
  private config: SwipeRefreshConfig;
  private spinnerRef: HTMLElement | null;
  private onStartRefresh: () => void;
  private onEndRefresh: () => void;
  private getScrollTopOverride?: () => number;

  constructor(
    element: HTMLElement,
    onRefresh: OnSwipeRefreshCallback,
    spinnerRef: HTMLElement | null,
    onStartRefresh: () => void,
    onEndRefresh: () => void,
    getScrollTopOverride?: () => number
  ) {
    this.node = element;
    this.onRefresh = onRefresh;
    this.spinnerRef = spinnerRef;
    this.config = {} as SwipeRefreshConfig;

    this.getScrollTopOverride = getScrollTopOverride;
    this.onStartRefresh = onStartRefresh;
    this.onEndRefresh = onEndRefresh;
  }

  private updateProgress(
    movementY: number,
    opacity: number,
    rotation: number = 0
  ) {
    requestAnimationFrame(() => {
      if (this.spinnerRef) {
        this.spinnerRef.style.transform = `translate(-50%, ${movementY}px) rotate(${rotation}deg)`;
        this.spinnerRef.style.opacity = `${opacity}`;
      }
    });
  }

  private reset() {
    this.config.state = "idle";
    this.config.movementY = 0;
    this.config.opacity = 0;
    this.config.rotation = 0;

    // clear any pending animation timeouts
    clearTimeout(this.config.refreshAnimationTimeout);

    this.hideSpinner();
    this.onEndRefresh();
  }

  private triggerRefresh() {
    this.onStartRefresh();

    this.onRefresh().finally(() => {
      this.reset();
    });
  }

  private getScrollTop() {
    return (
      this.getScrollTopOverride?.() ?? document.scrollingElement?.scrollTop
    );
  }

  public setRefreshing(value: boolean) {
    if (!value) {
      this.reset();
    }
  }

  private showSpinner() {
    if (this.spinnerRef) {
      this.spinnerRef.style.display = "flex";
    }
  }

  private hideSpinner() {
    if (this.spinnerRef) {
      this.spinnerRef.style.transform = "scale(0)";

      setTimeout(() => {
        if (this.spinnerRef) {
          this.spinnerRef.style.display = "none";
        }
      }, ANIMATION_DURATION);
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
          if (dy < THRESHOLD) {
            return;
          }

          this.config.state = "swiping";

          this.showSpinner();
        }

        const movementY = dy - THRESHOLD;

        // Swipe has not crossed the slingshot distance or swiping up
        // update the progress using the travel distance
        if (movementY <= SLINGSHOT_DISTANCE) {
          this.config.movementY = movementY;
        } else {
          // Beyond slingshot distance, add delta to give rubber band effect
          const overshoot = movementY - SLINGSHOT_DISTANCE;
          const dampedMovement = Math.pow(overshoot, 0.6);
          this.config.movementY = SLINGSHOT_DISTANCE + dampedMovement;
        }

        this.config.opacity = round(getOpacity(this.config.movementY));
        this.config.rotation = round(getRotation(this.config.movementY));

        this.updateProgress(
          this.config.movementY,
          this.config.opacity,
          this.config.rotation
        );
      }
    } catch (error) {}
  }

  private handleTouchEnd() {
    if (this.config.state === "swiping") {
      let restingOffset = RESTING_OFFSET;

      if (this.config.movementY >= SLINGSHOT_DISTANCE) {
        restingOffset = REFRESHING_OFFSET;
        this.config.state = "refreshing";

        this.triggerRefresh();
      } else {
        // reset the state
        this.config.state = "idle";
        this.config.opacity = 0;
      }

      this.updateProgress(
        restingOffset,
        this.config.opacity,
        this.config.rotation
      );
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
        {
          passive: true,
        }
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
  onRefresh: OnSwipeRefreshCallback,
  spinnerRef: HTMLElement | null,
  onStartRefresh: () => void,
  onEndRefresh: () => void,
  getScrollTop?: () => number
) =>
  new SwipeRefreshCoordinator(
    element,
    onRefresh,
    spinnerRef,
    onStartRefresh,
    onEndRefresh,
    getScrollTop
  );
