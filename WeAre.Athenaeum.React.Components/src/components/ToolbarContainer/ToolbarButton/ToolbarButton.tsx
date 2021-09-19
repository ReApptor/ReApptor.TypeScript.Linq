import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Button, {IButtonProps} from "../../Button/Button";
import Inline from "../../Layout.Inline/Inline";
import ToolbarContainerLocalizer from "../ToolbarContainerLocalizer";

import styles from "./ToolbarButton.module.scss";

export interface IToolbarButtonProps extends IButtonProps {
}

export default class ToolbarButton extends BaseComponent<IToolbarButtonProps> {
    
    render(): React.ReactNode {
        
        return (
            <div className={this.css("d-flex", styles.toolbarButton, this.props.className)}>
                <Inline>
                    <span>{ToolbarContainerLocalizer.get(this.props.label)}</span>
                    <Button {...this.props} small label={undefined} />
                </Inline>
            </div>
        );
    }
    
}