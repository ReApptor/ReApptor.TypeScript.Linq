import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";

import styles from "./ButtonContainer.module.scss";

export interface IButtonContainerProps {
    className?: string;
}

export interface IButtonContainerState {
}

export default class ButtonContainer extends BaseComponent<IButtonContainerProps, IButtonContainerState> {
    state: IButtonContainerState = {
    };

    private get buttons(): React.ReactElement[] {
        const buttons: React.ReactElement[] = React.Children.map(this.props.children, item => {
            return item as React.ReactElement;
        }) || [];
        return buttons;
    }

    private get left(): React.ReactElement[] {
        const buttons: React.ReactElement[] = this.buttons;
        const leftButtons: React.ReactElement[] = this.buttons.filter(item => item.props.right !== true);
        return (leftButtons.length != buttons.length)
            ? leftButtons
            : (buttons.length > 1)
                ? buttons.slice(0, buttons.length - 1)
                : [];
    }

    private get right(): React.ReactElement[] {
        const buttons: React.ReactElement[] = this.buttons;
        const rightButtons: React.ReactElement[] = this.buttons.filter(item => item.props.right === true);
        return (rightButtons.length > 0)
            ? (rightButtons)
            : (buttons.length > 1)
                ? buttons.slice(buttons.length - 1)
                : buttons;
    }
    
    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.buttonContainer, this.props.className)}>
                
                <div className={this.css(styles.left, "col-md-6")}>
                    {this.left}
                </div>
                
                <div className={this.css(styles.right, "col-md-6")}>
                    {this.right}
                </div>
                
            </div>
        )
    }
}