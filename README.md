# react-swipe-down-refresh

[![npm version](https://badge.fury.io/js/react-swipe-down-refresh.svg)](https://badge.fury.io/js/react-swipe-down-refresh)
[![license](https://img.shields.io/github/license/shettypuneeth/react-swipe-down-refresh.svg)](https://github.com/shettypuneeth/react-swipe-down-refresh/blob/main/LICENSE)

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

## Try it online

---

> Open in a mobile web-browser or toggle the device mode on a web-browser

Try the app [online here](https://g4xc0y.csb.app/).

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

|          Name           |                               Description                               | Required |               Default               |
| :---------------------: | :---------------------------------------------------------------------: | :------: | :---------------------------------: |
|        threshold        | Minimum gesture movement displacement before swipe action is registered |  false   |                 10                  |
|      onEndRefresh       |           Callback function triggered on refresh is complete            |  false   |                  -                  |
|     onStartRefresh      |              Callback function triggered on refresh start               |  false   |                  -                  |
|    slingshotDistance    | The distance the refresh indicator can be pulled during a swipe gesture |  false   |                 60                  |
|   progressViewOffset    |              The refresh indicator position during refresh              |  false   |                 30                  |
|   progressStrokeColor   |                  Color of the refresh progress spinner                  |  false   |               #2755c4               |
|  getScrollTopOverride   |              Scroll top position of the scrolling element               |  false   | document.scrollingElement.scrollTop |
| overrideBrowserRefresh  |                Override browser pull to refresh behavior                |  false   |                true                 |
| progressBackgroundColor |                Background color of the progress spinner                 |  false   |                #fff                 |

## Credits

---

- [Take control of your scroll](https://developer.chrome.com/blog/overscroll-behavior/)
- [Material loading spinner](https://codepen.io/jczimm/pen/vEBpoL)
