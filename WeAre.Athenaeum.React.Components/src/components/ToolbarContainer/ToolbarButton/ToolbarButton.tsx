import React from "react";
import {BaseComponent, PageRoute} from "@weare/athenaeum-react-common";

import styles from "./ToolbarButton.module.scss";
import {IIconProps} from "../../Icon/Icon";
import Button, {ButtonType} from "../../Button/Button";
import Inline from "../../Layout.Inline/Inline";
import ToolbarContainerLocalizer from "../ToolbarContainerLocalizer";

export interface IToolbarButtonProps {
    type?: ButtonType;
    label?: string;
    icon?: IIconProps;
    block?: boolean;
    submit?: boolean;
    dataTarget?: string;
    toggleModal?: boolean;
    dismissModal?: boolean;
    className?: string;
    route?: PageRoute;
    disabled?: boolean;
    onClick?(button: Button | null): Promise<void>;
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