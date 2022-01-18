import React, {ChangeEvent} from "react";
import {BaseInput, IBaseInputProps, IBaseInputState} from "@weare/athenaeum-react-components";

import styles from "./ColorInput.module.scss";

interface IColorInputProps extends IBaseInputProps<string> {
    disabled?: boolean;
    onChange?(sender: ColorInput, value:  string): Promise<void>;
}

interface IColorInputState extends IBaseInputState<string> {
}

export default class ColorInput extends BaseInput<string, IColorInputProps, IColorInputState> {

    state: IColorInputState = {
        readonly: this.props.disabled || false,
        model: {
            value: this.props.value || (this.props.model ? this.props.model.value : "#6d6d6d")
        },
        edit: true,
        validationError: null
    };

    public async setColorAsync(changeEvent: ChangeEvent<HTMLInputElement>): Promise<void> {
        this.state.model.value = changeEvent.target.value;
        if (this.props.onChange) {
            await this.props.onChange(this, changeEvent.target.value);
        }
        await this.reRenderAsync();
    }

    renderInput(): React.ReactNode {
        return (
            <div className={this.props.className}>
                <input type="color"
                       value={this.props.value!}
                       disabled={this.readonly}
                       onChange={(value) => this.setColorAsync(value)}
                />
            </div>
        );
    }    
}