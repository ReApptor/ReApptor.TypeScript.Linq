import React from "react";
import {ch, PageRoute, PageRouteProvider} from "@weare/reapptor-react-common";
import BaseWidget, { IBaseWidgetProps } from "./BaseWidget";

export type TPageRouteCallback = () => PageRoute;

export interface IBaseRouteWidgetProps extends IBaseWidgetProps {
    route?: PageRoute | TPageRouteCallback;
}

export default abstract class BaseRouteWidget<TProps extends IBaseRouteWidgetProps = {}, TData = {}>
    extends BaseWidget<TProps, TData> {

    protected getRoute(): PageRoute | null {

        const propsRoute: PageRoute | TPageRouteCallback | undefined = this.props.route;

        return (typeof propsRoute === "function")
            ? propsRoute()
            : (propsRoute)
                ? propsRoute
                : null;
    }

    protected getHref(): string {

        const route: PageRoute | null = this.getRoute();

        return (this.useRouting && route)
            ? PageRoute.toRelativePath(route)
            : super.getHref();
    }

    protected async onNavigateAsync(): Promise<void> {
    }

    protected async onClickAsync(e: React.SyntheticEvent): Promise<void> {
        if (this.isMounted) {
            e.stopPropagation();

            if (this.useRouting) {
                // e.stopPropagation does not stop the browser from navigating to the page the widget URL points to, this does.
                // If routing is not enabled, then the URL is javascript, which does not lead to navigation anyway.
                e.preventDefault();
            }

            await this.onNavigateAsync();

            const route: PageRoute | null = this.getRoute();

            if (route) {
                await PageRouteProvider.redirectAsync(route);
            }
        }
    }
}