import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "./ToolbarContainer.module.scss";

interface IToolbarContainerProps {
    className?: string;
}

export default class ToolbarContainer extends BaseComponent<IToolbarContainerProps> {
    
    render(): React.ReactNode {
        return(
            <div className={this.css(styles.toolbarContainer, "d-flex justify-content-between", this.props.className)}>
                {this.children}
            </div>
        );
    }
}