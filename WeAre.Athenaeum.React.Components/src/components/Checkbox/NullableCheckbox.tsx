import React from "react";
import BaseInput, { IBaseInputProps, IBaseInputState, NullableCheckboxType, ValidatorCallback } from "../../models/base/BaseInput";
import {BaseInputType} from "@/models/Enums";
import Icon, { IconSize } from "@/components/Icon/Icon";

import styles from "@/components/Checkbox/Checkbox.module.scss";

export interface INullableCheckboxProps extends IBaseInputProps<NullableCheckboxType> {
    excludeNull?: boolean;
    readonly?: boolean;
    onChange?(sender: NullableCheckbox, value: NullableCheckboxType): Promise<void>;
}

export interface INullableCheckboxState extends IBaseInputState<NullableCheckboxType> {
}

export default class NullableCheckbox<TProps extends INullableCheckboxProps = INullableCheckboxProps> extends BaseInput<NullableCheckboxType, TProps, INullableCheckboxState> {
    state: INullableCheckboxState = {
        validationError: null,
        edit: true,
        readonly: !!this.props.readonly,
        model: {
            value: this.props.value as NullableCheckboxType
        }
    };

    private async setAsync(value: NullableCheckboxType): Promise<void> {
        if ((!this.readonly) && (this.value !== value)) {
            
            await this.updateValueAsync(value);

            if (this.props.onChange) {
                await this.props.onChange(this, value);
            }
        }
    }
    
    protected async onLabelClick(): Promise<void> {
        await this.toggleAsync();
    }

    public getValidators(): ValidatorCallback<NullableCheckboxType>[] {
        return [];
    }

    public get value(): NullableCheckboxType {
        return this.state.model.value;
    }

    public get excludeNull(): boolean {
        return (!!this.props.excludeNull);
    }

    public getType(): BaseInputType {
        return BaseInputType.Checkbox;
    }

    public async toggleAsync(): Promise<void> {

        switch (this.value) {
            case true:
                await this.setAsync(false);
                break;

            case false:
                if (this.excludeNull) {
                    await this.setAsync(true);
                } else {
                    await this.setAsync(null);
                }
                break;

            case null:
                await this.setAsync(true);
                break;
        }
    }

    public async checkAsync(): Promise<void> {
        await this.setAsync(true);
    }

    public async uncheckAsync(): Promise<void> {
        await this.setAsync(false);
    }

    public async setNullAsync(): Promise<void> {
        if (this.excludeNull) {
            await this.toggleAsync();
        } else {
            await this.setAsync(null);
        }
    }
    
    private renderCheckedIcon(): React.ReactNode {
        if (this.value === null || !this.value) {
            return (<Icon name="far square" size={IconSize.X2}/>);
        }
        
        return (<Icon name="fas check-square" size={IconSize.X2} />);
    }

    public renderInput(): React.ReactNode {
        
        return (
            <div className={this.css(styles.checkbox, this.readonly && styles.readonly)}>
                <div className="position-relative" onClick={async () => await this.toggleAsync()}>
                    {
                        this.renderCheckedIcon()
                    }
                    
                    {
                        (this.value === null) &&
                        (
                            <span className={styles.square} />
                        )
                    }
                </div>
            </div>
        );
    }
}
