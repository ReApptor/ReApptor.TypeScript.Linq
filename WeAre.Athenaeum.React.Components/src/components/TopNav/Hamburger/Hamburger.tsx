import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { IMenuItem } from "../TopNav";
import Link from "../../Link/Link";
import Localizer from "../../../localization/Localizer";

import styles from "./Hamburger.module.scss";

interface IHamburgerProps {
    open: boolean;
    menuItems: IMenuItem[];
}

export default class Hamburger extends BaseComponent<IHamburgerProps> {

    public render(): React.ReactNode {

        const className: string = (this.props.open) ? styles.hamburger_open : styles.hamburger;

        return (
            <ul className={className}>
                {
                    this.props.menuItems.length &&
                    this.props.menuItems.map((item, index) => (
                        <li key={index}>
                            <Link className={styles.link} route={item.route}>{Localizer.get(item.label)}</Link>
                        </li>
                    ))
                }
            </ul>
        );
    }
};