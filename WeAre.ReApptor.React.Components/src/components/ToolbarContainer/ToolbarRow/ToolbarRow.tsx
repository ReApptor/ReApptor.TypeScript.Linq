import React from "react";
import {BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "./ToolbarRow.module.scss";
import Inline, {JustifyContent} from "../../Layout.Inline/Inline";

interface IToolbarRowProps extends IBaseContainerComponentProps {
    justify?: JustifyContent;
}

export default class ToolbarRow extends BaseComponent<IToolbarRowProps> {
    public render() {
        return (
            <Inline id={this.id} className={this.css(styles.toolbarRow, this.props.className)} justify={this.props.justify}>
                {this.props.children}
            </Inline>
        )
    }
}