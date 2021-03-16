import React from "react";
import BaseInput, {IBaseInputProps, IBaseInputState, LengthValidator, ValidatorCallback} from "../BaseInput/BaseInput";
import {BaseInputType} from "@weare/athenaeum-react-components/models/Enums";

import styles from "./TextAreaInput.module.scss";

export interface ITextAreaInputProps extends IBaseInputProps<string> {
    readonly?: boolean;
    autoFocus?: boolean;
    rows?: number;
    cols?: number;
    minLength?: number;
    maxLength?: number;
    placeholder?: string;
    noRemaining?: boolean;
    onChange?(sender: TextAreaInput, value: string): Promise<void>;
}

export interface ITextAreaInputState extends IBaseInputState<string> {
}

export default class TextAreaInput extends BaseInput<string, ITextAreaInputProps, ITextAreaInputState> {
    
    private readonly _inputRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
    
    state: ITextAreaInputState = {
        model: this.props.model || {value: this.props.value || ""},
        edit: true,
        readonly: this.props.readonly || false,
        validationError: ""
    };

    private progressBar(): string {
        const length: number = this.length;
        const maxLength: number = this.maxLength;
        const value: number = 100 - ((maxLength - length) / maxLength) * 100;
        return value + "%";
    }

    protected async valueChangeHandlerAsync(event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>): Promise<void> {
        await super.valueChangeHandlerAsync(event);
        
        if (this.props.onChange) {
            await this.props.onChange(this, this.value);
        }
    }
    
    protected getType(): BaseInputType {
        return BaseInputType.TextArea;
    }

    public getValidators(): ValidatorCallback<string>[] {
        return (this.props.minLength)
            ? [LengthValidator.validator(this.props.minLength)]
            : [];
    }

    public get value(): string {
        return this.state.model.value || "";
    }
    
    public focus(): void {
        if (this._inputRef.current) {
            this._inputRef.current!.focus();
        }
    }
    
    public get maxLength(): number {
        return this.props.maxLength || 1000;
    }
    
    public get length(): number {
        return this.str.length;
    }
    
    public get noRemaining(): boolean {
        return (this.props.noRemaining === true);
    }

    public renderInput(): React.ReactNode {
        return (
            <div className={styles.textAreaInput}>
                
                <textarea id={this.getInputId()}
                          ref={this._inputRef}
                          className="form-control"
                          value={this.str}
                          required={this.props.required}
                          readOnly={this.readonly}
                          rows={this.props.rows || 4}
                          cols={this.props.cols}
                          maxLength={this.maxLength}
                          autoFocus={this.props.autoFocus}
                          placeholder={this.props.placeholder}
                          onChange={async (e: React.FormEvent<HTMLTextAreaElement>) => await this.valueChangeHandlerAsync(e)}
                          onBlur={async () => await this.valueBlurHandlerAsync()}
                />
                
                { (!this.noRemaining) && <div className={styles.progressBar}><div style={{width: this.progressBar()}}/></div> }
                
            </div>
        );
    }
}
