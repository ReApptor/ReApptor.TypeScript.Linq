import React from "react";
import {PageRoute, PageRouteProvider, BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";
import {IMenuItem, TMenuItemRoute} from "../TopNav/TopNav";

import styles from "./Link.module.scss";

export type TLinkRoute = PageRoute | ((sender: Link) => Promise<void>);

export interface ILinkProps extends IBaseContainerComponentProps {
    route?: TLinkRoute | null;
}

export default class Link extends BaseComponent<ILinkProps> {

    private async handleClickAsync(e: React.MouseEvent<HTMLAnchorElement>): Promise<boolean> {
        e.preventDefault();

        if (this.route) {
            if (typeof this.route === "function") {
                await this.route(this);
            } else {
                await PageRouteProvider.redirectAsync(this.route);
            }
        }

        return false;
    }

    private get route(): TLinkRoute | null {
        return this.props.route ?? null;
    }

    private get href(): string {
        return ((this.route == null) || (typeof this.route === "function"))
            ? "#"
            : (this.useRouting)
                ? PageRoute.toRelativePath(this.route)
                : this.route.name;
    }

    public static toRoute(menuItem: IMenuItem): TLinkRoute | null {
        if (menuItem.route) {
            const route: TMenuItemRoute = menuItem.route;
            return (typeof route === "function")
                ? async () => route(menuItem)
                : route;
        }

        return null;
    }

    public render(): React.ReactNode {
        return (
            <a id={this.id}
               className={this.css(styles.link, this.props.className)}
               href={this.href}
               onClick={(e: React.MouseEvent<HTMLAnchorElement>) => this.handleClickAsync(e)}
            >
                {this.props.children}
            </a>
        );
    }
};