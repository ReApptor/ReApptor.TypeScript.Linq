import React from "react";
import BaseCheckboxWidget, { IBaseCheckboxWidgetProps } from "../WidgetContainer/BaseCheckboxWidget";

import styles from "../WidgetContainer/WidgetContainer.module.scss";

export interface ISwitchWidgetProps extends IBaseCheckboxWidgetProps {
    leftLabel: string;
    rightLabel: string;
    checkedClassName?: string;
    onChange?(sender: SwitchWidget, checked: boolean): Promise<void>;
}

export default class SwitchWidget extends BaseCheckboxWidget<ISwitchWidgetProps> {

    protected async onChangeAsync(checked: boolean): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, checked);
        }
    }

    protected renderContent(renderHidden: boolean = false): React.ReactNode {
        const toggleStyles = (this.checked) ? styles.checked : styles.switch;
        const toggleExternalStyles = (this.checked) ? this.props.checkedClassName : "";

        return (
            <div className={this.css(styles.switchContent, toggleExternalStyles)}>
                <div className={styles.status}>
                    <span>{this.props.leftLabel}</span>
                </div>

                <div className={toggleStyles}>
                    <span className={styles.toggler}/>
                </div>

                <div className={styles.status}>
                    <span>{this.props.rightLabel}</span>
                </div>
            </div>
        );
    }
};