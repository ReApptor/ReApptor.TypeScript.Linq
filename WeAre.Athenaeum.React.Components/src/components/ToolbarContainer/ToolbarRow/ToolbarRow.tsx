import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "./ToolbarRow.module.scss";
import Inline, {JustifyContent} from "../../Layout.Inline/Inline";

interface IToolbarRowProps {
    justify?: JustifyContent;
    className?: string;
}

export default class ToolbarRow extends BaseComponent<IToolbarRowProps> {
    public render() {
        return (
            <Inline className={this.css(styles.toolbarRow, this.props.className)} justify={this.props.justify}>
                {this.props.children}
            </Inline>
        )
    }
}