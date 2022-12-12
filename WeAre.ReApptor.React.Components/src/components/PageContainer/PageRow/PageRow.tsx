import React from "react";
import {BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "../PageContainer.module.scss";

export interface IPageRowProps extends IBaseContainerComponentProps {
}

export default class PageRow extends BaseComponent<IPageRowProps> {
    
    public minimize(duration: number | null | undefined = undefined): void {
        const node: JQuery = this.getNode();
        const properties = {
            opacity: 0,
            height: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingTop: 0,
            paddingBottom: 0
        };
        if (duration) {
            node.animate(properties, duration);
        } else {
            node.animate(properties);
        }
    }
    
    public render(): React.ReactNode {
        return (
            <div id={this.id} className={this.css(styles.row, "row", this.props.className)}>
                {this.props.children}
            </div>
        );
    }
};