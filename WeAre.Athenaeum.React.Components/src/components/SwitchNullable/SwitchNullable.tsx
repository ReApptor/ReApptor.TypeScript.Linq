import React from "react";
import CheckboxNullable, { INullableCheckboxProps } from "@/components/CheckboxNullable/CheckboxNullable";

import styles from "../Switch/Switch.module.scss";

interface INullableSwitchProps extends INullableCheckboxProps {
    leftLabel?: string;
    rightLabel?: string;
}

export default class SwitchNullable extends CheckboxNullable<INullableSwitchProps> {
    
    renderInput(): React.ReactNode {
        const toggleStyles = (this.value === false)
                                ? styles.nullableSwitchUnchecked
                                : (this.value === true) 
                                    ? styles.nullableSwitchChecked 
                                : styles.nullableSwitch;
        
        return (
            <div className={styles.container}>
                {
                    this.props.leftLabel && <span className={styles.label}>{this.props.leftLabel}</span>
                }
                <div className={this.css(toggleStyles, (this.readonly && styles.readonly))}>
                    <div className={styles.zone} onClick={async () => await this.uncheckAsync()} />
                    <div className={styles.zone} onClick={async () => await this.setNullAsync()} />
                    <div className={styles.zone} onClick={async () => await this.checkAsync()} />

                    <span className={styles.toggler} />
                </div>

                {
                    this.props.rightLabel && <span className={styles.label}>{this.props.rightLabel}</span>
                }
            </div>
        );
    }
}
