import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "../Layout/Layout.module.scss";

interface ITwoColumnsProps {
    className?: string;
    leftClassName?: string;
    rightClassName?: string;
}

export default class TwoColumns extends BaseComponent<ITwoColumnsProps> {
    
    private get leftClassName(): string {
        return this.props.leftClassName || "col-md-6";
    }

    private get rightClassName(): string {
        return this.props.rightClassName || "col-md-6";
    }

    private renderRow(left: React.ReactNode | null, right: React.ReactNode | null): React.ReactNode {
        return (
            <div className={this.css(styles.row, this.props.className, "row")}>
                <div className={this.leftClassName}>
                    {left}
                </div>
                <div className={this.rightClassName}>
                    {right}
                </div>
            </div>
        );
    }

    render(): React.ReactNode {
        return (
            <React.Fragment>
                {
                    (this.props.children) && (this.children.length > 0) && this.renderRow(this.children[0], this.children[1])
                }
            </React.Fragment>
        );
    }
};
