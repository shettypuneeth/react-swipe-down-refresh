# react-swipe-down-refresh

Swipe down to refresh or pull-to-refresh control for mobile web applications.

The component is built using composable utilities to give fine grain control over the swipe-refresh behavior. These building blocks could be used independently to build your own swipe-refresh control.

### Components and utils

- `SwipeRefreshList`—React component with swipe-refresh behavior
- `useSwipeRefresh`—React hook that encapsulates the swipe-refresh logic
- `SwipeRefreshCoordinator`—UI framework agnostic implementation of the core gesture handling logic

## Getting started

---

To start using react-swipe-down-refresh, install it via NPM

```sh
npm i react-swipe-down-refresh

# yarn
yarn add react-swipe-down-refresh
```

## Demo

---

## Usage

---

Import the `SwipeRefreshList` component and include the styles provided in the package to get the swipe-refresh behavior.
Make sure your build system supports importing _.css_ files.

```tsx
import { SwipeRefreshList } from "react-swipe-down-refresh";

// include the styles
import "react-swipe-down-refresh/lib/styles.css";

export default function App() {
  const onRefreshRequested = () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
    });
  };

  return (
    <div>
      <SwipeRefreshList onRefresh={onRefreshRequested}>
        <div className="item">Line 1</div>
        <div className="item">Line 2</div>
        <div className="item">Line 3</div>
      </SwipeRefreshList>
    </div>
  );
}
```

## Props

|   Name    |                Description                | Required | Default |
| :-------: | :---------------------------------------: | :------: | :-----: |
| onRefresh |  Callback function triggered on refresh   |   true   |    -    |
| disabled  |         Disabled pull to refresh          |  false   |  false  |
| className | CSS class to attache to the outermost div |  false   |    -    |

## Customization

You can customize the swipe refresh spinner look and behavior via the following the props

|          Name           |                               Description                               | Required | Default |
| :---------------------: | :---------------------------------------------------------------------: | :------: | :-----: |
|        threshold        | Minimum gesture movement displacement before swipe action is registered |  false   |  false  |
|      onEndRefresh       |           Callback function triggered on refresh is complete            |  false   |  false  |
|     onStartRefresh      |              Callback function triggered on refresh start               |  false   |  false  |
|    slingshotDistance    | The distance the refresh indicator can be pulled during a swipe gesture |  false   |  false  |
|   progressViewOffset    |              The refresh indicator position during refresh              |  false   |  false  |
|   progressStrokeColor   |                  Color of the refresh progress spinner                  |  false   |  false  |
|  getScrollTopOverride   |                        Disabled pull to refresh                         |  false   |  false  |
| overrideBrowserRefresh  |               Override browser pull to refresh behaviour                |  false   |  false  |
| progressBackgroundColor |                Background color of the progress spinner                 |  false   |  false  |

## Credits

---

- [Take control of your scroll](https://developer.chrome.com/blog/overscroll-behavior/)
