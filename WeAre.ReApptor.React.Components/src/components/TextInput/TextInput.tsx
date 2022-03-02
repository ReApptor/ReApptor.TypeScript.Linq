import React from "react";
import {BaseInputType} from "@weare/reapptor-react-common";
import BaseInput, {ValidatorCallback, IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import AutoSuggest, { AutoSuggestItem } from "./AutoSuggest/AutoSuggest";
import TextInputLocalizer from "./TextInputLocalizer";

import styles from "./TextInput.module.scss";

export interface ITextInputProps extends IBaseInputProps<string> {
    minLength?: number;
    maxLength?: number;
    size?: number;
    title?: string;
    readonly?: boolean;
    hideInput?: boolean;
    inline?: boolean;
    small?: boolean;
    width?: string | null;
    placeholder?: string;
    autoSuggestItems?: AutoSuggestItem[];
    autoFocus?: boolean;
    trim?: boolean;
    /**
    * @deprecated The prop should not be used, use "noAutoComplete" instead to disable browser auto complete (auto-fill)
    */
    autoComplete?: boolean;
    /**
     * Disable disable browser auto complete (auto-fill)
     */
    noAutoComplete?: true;
    
    onChange?(sender: TextInput, value: string, userInteraction: boolean, done: boolean): Promise<void>;
    onBlur?(sender: TextInput): Promise<void>;
}

export interface ITextInputState extends IBaseInputState<string> {
}

export default class TextInput extends BaseInput<string, ITextInputProps, ITextInputState> {
    
    private readonly _autoSuggestRef: React.RefObject<AutoSuggest> = React.createRef();

    private async onChangeAsync(event: React.FormEvent<HTMLInputElement>): Promise<void> {
        
        await this.valueChangeHandlerAsync(event);
        
        if (this.props.onChange) {
            await this.props.onChange(this, this.value, true, false);
        }
    }

    private async onInputKeyDownHandlerAsync(e: React.KeyboardEvent<any>): Promise<void> {
        const enter: boolean = (e.keyCode === 13);
        if (this.props.clickToEdit) {
            if ((enter) || (e.keyCode === 27)) {
                e.preventDefault();
                await this.hideEditAsync();
            }
        } else if ((enter) && (this.props.onChange)) {
            await this.props.onChange(this, this.value, true, true);
        }
    }
    
    private async toggleAutoSuggest(): Promise<void> {
        const autoSuggest: AutoSuggest | null = this._autoSuggestRef.current;
        
        if (autoSuggest) {
            await autoSuggest.toggleAsync();
        }
    }
    
    private async setValueFromAutoSuggest(value: string): Promise<void> {
        await this.updateValueAsync(value);
    }
    
    private get autoSuggestItems(): any[] {
        return this.props.autoSuggestItems ? this.props.autoSuggestItems : [];
    }
    
    private get toggleButtonId(): string {
        return `auto-suggest-toggler-${this.id}`;
    }
    
    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    protected async onHideEditAsync(): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, this.value, true, true);
        }
    }

    protected async valueBlurHandlerAsync(): Promise<void> {
        await super.validateAsync();
        
        if (this.props.onBlur) {
            await this.props.onBlur(this);
        }
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [];
    }

    public focus(): void {
        if (this.inputElement) {
            this.inputElement.focus();
        }
    }

    public get value(): string {
        const value: string = this.state.model.value || "";
        return (this.props.trim)
            ? value.trim()
            : value;
    }

    public get str(): string {
        return this.state.model.value || "";
    }
    
    public get noAutoComplete(): boolean {
        return (this.props.noAutoComplete == true) || (this.props.autoComplete === false);
    }

    public renderInput(): React.ReactNode {

        const smallStyle: any = (this.props.small) && styles.small;

        const autoSuggestStyle: any = (this.autoSuggestItems.length) && styles.autoSuggest;

        const inlineStyles: React.CSSProperties = {};

        if (this.props.width) {
            inlineStyles.width = this.props.width;
        }

        return (
            <React.Fragment>
                
                <input id={this.getInputId()}
                       type={this.getType()}
                       className={this.css(styles.textInput, "form-control", smallStyle, autoSuggestStyle)}
                       style={inlineStyles}
                       title={TextInputLocalizer.get(this.props.title)}
                       placeholder={TextInputLocalizer.get(this.props.placeholder)}
                       value={this.str}
                       readOnly={this.readonly}
                       size={this.props.size || 10}
                       minLength={this.props.minLength || 0}
                       maxLength={this.props.maxLength || 255}
                       autoFocus={this.props.autoFocus}
                       autoComplete={this.noAutoComplete ? "off" : ""}
                       role={this.noAutoComplete ? "presentation" : ""}
                       onChange={async (e: React.FormEvent<HTMLInputElement>) => await this.onChangeAsync(e)}
                       onBlur={async () => await this.valueBlurHandlerAsync()}
                       onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyDownHandlerAsync(e)}
                />

                {
                    (this.autoSuggestItems.length > 0) &&
                    (
                        <React.Fragment>
                            
                            <i id={this.toggleButtonId}
                               className={this.css(styles.icon, "fa fa-caret-down")}
                               onClick={async () => await this.toggleAutoSuggest()}
                            />

                            <AutoSuggest ref={this._autoSuggestRef}
                                         items={this.autoSuggestItems}
                                         toggleButtonId={this.toggleButtonId}
                                         onSelect={async (_, value) => await this.setValueFromAutoSuggest(value)}
                            />
                            
                        </React.Fragment>
                    )
                }
                
            </React.Fragment>
        );
    }
}