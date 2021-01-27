import React from "react";
import BaseInput, {ValidatorCallback, IBaseInputProps, IBaseInputState, LengthValidator} from "../BaseInput";
import { BaseInputType  } from "@/models/Enums";

export interface ITextAreaInputProps extends IBaseInputProps<string> {
    readonly?: boolean;
    autoFocus?: boolean;
    rows?: number;
    cols?: number;
    minLength?: number;
    maxLength?: number;
    showRemaining?: boolean;
    placeholder?: string;
    onChange?(sender: TextAreaInput, value: string): Promise<void>;
}

export interface ITextAreaInputState extends IBaseInputState<string> {
    charactersLeft: number | null;
}

export default class TextAreaInput extends BaseInput<string, ITextAreaInputProps, ITextAreaInputState> {
    
    private readonly _maxCharacters: number = 1000;
    private readonly _inputRef: React.RefObject<HTMLTextAreaElement> = React.createRef();
    
    state: ITextAreaInputState = {
        charactersLeft: this._maxCharacters,
        model: this.props.model || {value: this.props.value || ""},
        edit: true,
        readonly: this.props.readonly || false,
        validationError: ""
    };

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
    
    private onKeyPressHandler(): void {
        this.setState({charactersLeft: this._maxCharacters - this.str.length})
    }

    public renderInput(): React.ReactNode {
        return (
            <div>
                <textarea
                    id={this.getInputId()}
                    ref={this._inputRef}
                    className="form-control"
                    value={this.str}
                    //required={this.props.required}
                    readOnly={this.readonly}
                    rows={this.props.rows || 4}
                    cols={this.props.cols}
                    maxLength={this.props.maxLength || 1000}
                    autoFocus={this.props.autoFocus}
                    placeholder={this.props.placeholder}
                    onKeyUp={() => this.onKeyPressHandler()}
                    onChange={async (e: React.FormEvent<HTMLTextAreaElement>) => await this.valueChangeHandlerAsync(e)}
                    onBlur={async () => await this.valueBlurHandlerAsync()}
                />
                {this.props.showRemaining && <span>{this.state.charactersLeft} remaining</span>}
            </div>
        );
    }
}