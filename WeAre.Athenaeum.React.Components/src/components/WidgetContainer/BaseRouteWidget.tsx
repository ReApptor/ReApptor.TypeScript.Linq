import React from "react";
import {PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import BaseWidget, { IBaseWidgetProps } from "./BaseWidget";

export type TPageRouteCallback = () => PageRoute;

export interface IBaseRouteWidgetProps extends IBaseWidgetProps {
    route?: PageRoute | TPageRouteCallback;
}

export default abstract class BaseRouteWidget<TProps extends IBaseRouteWidgetProps = {}, TData = {}> extends BaseWidget<TProps, TData> {

    protected async onNavigateAsync(): Promise<void> {
    }

    protected async onClickAsync(e: React.SyntheticEvent): Promise<void> {
        if (this.isMounted) {
            e.stopPropagation();

            await this.onNavigateAsync();

            if (this.props.route) {
                
                const route: PageRoute = (typeof this.props.route === "function")
                    ? this.props.route()
                    : this.props.route as PageRoute;
                
                await PageRouteProvider.redirectAsync(route);
            }
        }
    }
}