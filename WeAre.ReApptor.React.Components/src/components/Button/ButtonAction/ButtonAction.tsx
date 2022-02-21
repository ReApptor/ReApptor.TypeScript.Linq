import React from "react";
import Icon, { IIconProps } from "../../Icon/Icon";
import { BaseComponent, Justify } from "@weare/reapptor-react-common";

import styles from "../Button.module.scss";

export interface IButtonActionProps {
    title: string;
    icon?: IIconProps;
    iconPosition?: Justify;
    onClick(): Promise<void>;
}

export default class ButtonAction extends BaseComponent<IButtonActionProps> {
    private get hasIcon(): boolean {
        return !!this.props.icon;
    }

    private get hasIconPosition(): boolean {
        return !!this.props.iconPosition;
    }

    private get isIconPositionLeft(): boolean {
        return this.hasIcon && !this.hasIconPosition;
    }

    private get isIconPositionRight(): boolean {
        return this.hasIcon && this.hasIconPosition && this.props.iconPosition == Justify.Right;
    }

    public render(): React.ReactNode {
        return (
            <div className={styles.action} onClick={() => this.props.onClick()}>

                {this.isIconPositionLeft && <Icon {...(this.props.icon as IIconProps)} />}

                <span>{this.props.title}</span>

                {this.isIconPositionRight && <Icon {...(this.props.icon as IIconProps)} />}

            </div>
        );
    }
}
