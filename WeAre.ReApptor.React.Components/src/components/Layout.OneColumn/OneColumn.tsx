import React from "react";
import {BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "../Layout/Layout.module.scss";

interface IOneColumnProps extends IBaseContainerComponentProps {
}

export default class OneColumn extends BaseComponent<IOneColumnProps> {

    private renderRow(index: number, item: React.ReactNode): React.ReactNode {
        return (
            <div key={index} className={this.css(styles.row, "row")}>
                <div className="col-md-12">
                    {item}
                </div>
            </div>
        );
    }

    public render(): React.ReactNode {
        return (
            <div id={this.id} className={this.props.className}>
                {
                    (this.props.children) && (this.children.length > 0) && this.children.map((item, index) => this.renderRow(index, item))
                }
            </div>
        );
    }
};
