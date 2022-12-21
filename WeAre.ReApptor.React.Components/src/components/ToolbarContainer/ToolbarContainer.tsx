import React from "react";
import {BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "./ToolbarContainer.module.scss";

interface IToolbarContainerProps extends IBaseContainerComponentProps {
}

export default class ToolbarContainer extends BaseComponent<IToolbarContainerProps> {

    public render(): React.ReactNode {
        return (
            <div id={this.id} className={this.css(styles.toolbarContainer, "d-flex justify-content-between", this.props.className)}>
                {this.children}
            </div>
        );
    }
}