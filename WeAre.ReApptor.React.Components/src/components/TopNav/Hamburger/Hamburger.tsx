import React from "react";
import {BaseComponent, ch, PageRoute} from "@weare/reapptor-react-common";
import {IMenuItem} from "../TopNav";
import Link, {TLinkRoute} from "../../Link/Link";
import TopNavLocalizer from "../TopNavLocalizer";

import styles from "./Hamburger.module.scss";
import Comparator from "../../../helpers/Comparator";

interface IHamburgerProps {
    open: boolean;
    menuItems: IMenuItem[];
}

export default class Hamburger extends BaseComponent<IHamburgerProps> {
    public renderMenuItem(item: IMenuItem, index: number): React.ReactNode {
        const linkRoute: TLinkRoute | null = Link.toRoute(item);
        const pageRoute: PageRoute | null = (typeof linkRoute === "object") ? linkRoute as PageRoute | null : null;
        const active: boolean = (pageRoute != null) && (Comparator.isEqualPageRoute(pageRoute, ch.findPageRoute()));
        const activeStyle: any = active && styles.active;
        return (
            <li key={index}>
                <Link className={this.css(styles.link, activeStyle)} route={linkRoute}>{TopNavLocalizer.get(item.label)}</Link>
            </li>
        );
    }

    public render(): React.ReactNode {

        const className: string = (this.props.open) ? styles.hamburger_open : styles.hamburger;

        return (
            <ul className={className}>
                {
                    this.props.menuItems.length &&
                    this.props.menuItems.map((item: IMenuItem, index: number) => this.renderMenuItem(item, index))
                }
            </ul>
        );
    }
};