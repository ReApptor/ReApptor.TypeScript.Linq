import React from "react";
import {PageRoute, PageRouteProvider} from "@weare/athenaeum-react-common";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "./Link.module.scss";

interface ILinkProps {
    route: PageRoute,
    className?: string;
    children: React.ReactNode;    
}

export default class Link extends BaseComponent<ILinkProps> {
    private async handleClickAsync(e: React.MouseEvent<HTMLAnchorElement>): Promise<boolean> {
        e.preventDefault();

        await PageRouteProvider.redirectAsync(this.props.route);

        return false;
    }

    render(): React.ReactNode {
        return (
            <a className={this.css(styles.link, this.props.className)} href={this.props.route.name} onClick={async (e: React.MouseEvent<HTMLAnchorElement>) => await this.handleClickAsync(e)}>{this.props.children}</a>
        );
    }
};