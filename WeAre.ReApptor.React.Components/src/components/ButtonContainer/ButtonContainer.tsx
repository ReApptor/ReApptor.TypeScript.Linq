import React from "react";
import {BaseComponent, IBaseContainerComponentProps} from "@weare/reapptor-react-common";

import styles from "./ButtonContainer.module.scss";

export interface IButtonContainerProps extends IBaseContainerComponentProps {
}

export interface IButtonContainerState {
}

export default class ButtonContainer extends BaseComponent<IButtonContainerProps, IButtonContainerState> {
    state: IButtonContainerState = {
    };

    private getButtons(): React.ReactElement[] {
        // noinspection UnnecessaryLocalVariableJS
        const buttons: React.ReactElement[] = React.Children.map(this.props.children, item => {
            return item as React.ReactElement;
        }) || [];
        return buttons;
    }

    private getLeft(buttons: React.ReactElement[]): React.ReactElement[] {
        const undefinedOrder: boolean = buttons.every(item => item.props.right == null);
        if (undefinedOrder) {
            return (buttons.length > 1)
                ? buttons.slice(0, buttons.length - 1)
                : [];
        }
        
        return buttons.filter(item => item.props.right !== true);
    }

    private getRight(buttons: React.ReactElement[]): React.ReactElement[] {
        const undefinedOrder: boolean = buttons.every(item => item.props.right == null);
        if (undefinedOrder) {
            return (buttons.length > 1)
                ? buttons.slice(buttons.length - 1)
                : buttons;
        }
        
        return buttons.filter(item => item.props.right === true);
    }
    
    public render(): React.ReactNode {
        const buttons: React.ReactElement[] = this.getButtons();
        const left: React.ReactElement[] = this.getLeft(buttons);
        const right: React.ReactElement[] = this.getRight(buttons);
        const leftEmpty: boolean = (left.length == 0);
        const rightEmpty: boolean = (right.length == 0);
        const rightMargin: boolean = (!leftEmpty) && (!rightEmpty);
        
        return (
            <div className={this.css(styles.buttonContainer, this.props.className)}>
                
                <div className={this.css(styles.row, styles.left, leftEmpty && styles.empty)}>
                    {left}
                </div>
                
                <div className={this.css(styles.row, styles.right, rightEmpty && styles.empty, rightMargin && styles.margin)}>
                    {right}
                </div>
                
            </div>
        )
    }
}