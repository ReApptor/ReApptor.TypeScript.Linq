import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "../Layout/Layout.module.scss";

interface IOneColumnProps {
    className?: string;
}

export default class LayoutOneColumn extends BaseComponent<IOneColumnProps> {

    private renderRow(index: number, item: React.ReactNode): React.ReactNode {
        return (
            <div key={index} className={this.css(styles.row, "row")}>
                <div className="col-md-12">
                    {item}
                </div>
            </div>
        );
    }

    render(): React.ReactNode {
        return (
            <div className={this.props.className}>
                {
                    (this.props.children) && (this.children.length > 0) && this.children.map((item, index) => this.renderRow(index, item))
                }
            </div>
        );
    }
};
