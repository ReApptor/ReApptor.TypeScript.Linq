import React from "react";
import BaseCheckboxWidget, { IBaseCheckboxWidgetProps } from "../WidgetContainer/BaseCheckboxWidget";
import {IIconProps} from "@/components/Icon/Icon";

import styles from "../WidgetContainer/WidgetContainer.module.scss";
import Checkbox from "@/components/Checkbox/Checkbox";

export interface ICheckStepWidgetProps extends IBaseCheckboxWidgetProps {
    onChange?(sender: CheckStepWidget, checked: boolean): Promise<void>;
}

export default class CheckStepWidget extends BaseCheckboxWidget<ICheckStepWidgetProps> {

    public get minimized(): boolean {
        return false;
    }

    protected async onChangeAsync(checked: boolean): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, checked);
        }
    }
    
    protected get icon(): IIconProps | null {
        return null;
    }

    protected renderLabel(): React.ReactNode {
        return null;
    }

    protected renderDescription(): React.ReactNode {
        return null;
    }

    protected renderMinimized(): React.ReactNode {
        return null;
    }
    
    protected get wide(): boolean {
        return true;
    }

    protected getInnerClassName(): string {
        return styles.checkStepContainer;
    }

    protected renderContent(): React.ReactNode {
        return (
            <div className={styles.checkStep}>
                
                <div className="d-flex justify-content-between">

                    {
                        this.label &&
                        (
                            <span>{this.label}</span>
                        )
                    }

                    <Checkbox className={styles.checkbox} 
                              value={this.checked} 
                              onChange={async(sender: Checkbox, value: boolean) => await this.onChangeAsync(value)} />
                    
                </div>
                
                {
                    this.description &&
                    (
                        <span>{this.description}</span>
                    )
                }
            </div>
        );
    }
};
