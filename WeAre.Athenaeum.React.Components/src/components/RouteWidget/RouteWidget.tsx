import BaseRouteWidget, { IBaseRouteWidgetProps } from "../WidgetContainer/BaseRouteWidget";

export interface IRouteWidgetProps extends IBaseRouteWidgetProps {
    onClick?(): Promise<void>;
}

export default class RouteWidget extends BaseRouteWidget<IRouteWidgetProps> {

    protected async onNavigateAsync(): Promise<void> {
        if (this.props.onClick) {
            await this.props.onClick();
        }
    }
}
