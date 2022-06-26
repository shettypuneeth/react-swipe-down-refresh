import type { ReactNode } from "react";
import type { SwipeRefreshAttributes } from "./SwipeRefreshCoordinator";
interface SwipeRefreshListProps {
    children: ReactNode | ReactNode[];
    onRefresh: () => Promise<void>;
    disabled?: boolean;
    className?: string;
}
export default function SwipeRefreshList(props: SwipeRefreshListProps & SwipeRefreshAttributes): JSX.Element;
export {};
