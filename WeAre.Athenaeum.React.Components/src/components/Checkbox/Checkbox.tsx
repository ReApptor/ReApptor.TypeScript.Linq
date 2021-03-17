import React from "react";
import BaseInput, {IBaseInputProps, IBaseInputState, ValidatorCallback} from "../BaseInput/BaseInput";
import Icon, {IconSize} from "../Icon/Icon";

import styles from "./Checkbox.module.scss";
import { BaseInputType } from "../../models/Enums";

export enum InlineType {
    Left,

    Right
}

export interface ICheckboxProps extends IBaseInputProps<boolean> {
    readonly?: boolean;
    inlineType?: InlineType;
    onChange?(sender: Checkbox, checked: boolean): Promise<void>;
}

export interface ICheckboxState extends IBaseInputState<boolean> {
}

export default class Checkbox<TProps extends ICheckboxProps = ICheckboxProps> extends BaseInput<boolean, TProps, ICheckboxState> {
    state: ICheckboxState = {
        validationError: null,
        edit: true,
        readonly: !!this.props.readonly,
        model: {
            value: !!this.props.value
        }
    };

    private async setAsync(checked: boolean): Promise<void> {
        if (this.checked !== checked) {
            
            await this.updateValueAsync(checked);

            if (this.props.onChange) {
                await this.props.onChange(this, checked);
            }
        }
    }
    
    protected async onLabelClick(): Promise<void> {
        await this.toggleAsync();
    }
    
    protected getContainerClassname(): string {
        return (this.props.inline && this.props.inlineType && this.props.inlineType === InlineType.Right) ? styles.inlineRight : "";
    }

    public get checked(): boolean {
        return this.value;
    }

    public getValidators(): ValidatorCallback<boolean>[] {
        return [];
    }

    public get value(): boolean {
        return this.state.model.value || false;
    }

    public getType(): BaseInputType {
        return BaseInputType.Checkbox;
    }

    public async toggleAsync(event: React.MouseEvent<HTMLDivElement> | null = null): Promise<void> {
        if (!this.readonly) {
            await this.setAsync(!this.checked);
        }
    }

    public async checkAsync(): Promise<void> {
        if (!this.checked) {
            await this.toggleAsync();
        }
    }

    public async uncheckAsync(): Promise<void> {
        if (this.checked) {
            await this.toggleAsync();
        }
    }

    public renderInput(): React.ReactNode {
        return (
            <div className={this.css(styles.checkbox, this.readonly && styles.readonly)}>
                <div onClick={async (event) => await this.toggleAsync(event)}>
                    {
                        (this.checked)
                            ? (<Icon name="fas check-square" size={IconSize.X2} />)
                            : (<Icon name="far square" size={IconSize.X2} />)
                    }
                </div>
            </div>
        );
    }
}
