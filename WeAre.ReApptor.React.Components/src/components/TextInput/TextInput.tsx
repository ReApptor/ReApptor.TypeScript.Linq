import React from "react";
import {BaseInputType} from "@weare/reapptor-react-common";
import BaseInput, {ValidatorCallback, IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import AutoSuggest, { AutoSuggestItem } from "./AutoSuggest/AutoSuggest";
import Icon, {IconSize} from "../Icon/Icon";
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
    width?: string | number | null;
    placeholder?: string;
    autoSuggestItems?: AutoSuggestItem[];
    autoFocus?: boolean;
    trim?: boolean;
    
    /**
    * @deprecated The prop should not be used, use "noAutoComplete" instead to disable browser auto complete (auto-fill)
    */
    autoComplete?: boolean;
    
    /**
     * Disable browser auto complete (auto-fill)
     */
    noAutoComplete?: true;
    
    /**
     * The 'X' button to clear the text
     */
    clearButton?: boolean;
    
    onChange?(sender: TextInput, value: string, userInteraction: boolean, done: boolean): Promise<void>;
    onBlur?(sender: TextInput): Promise<void>;
    onClick?(sender: TextInput): Promise<void>;
}

export interface ITextInputState extends IBaseInputState<string> {
}

export default class TextInput extends BaseInput<string, ITextInputProps, ITextInputState> {
    
    private readonly _autoSuggestRef: React.RefObject<AutoSuggest> = React.createRef();
    
    private async invokeOnChangeAsync(): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, this.value, true, false);
        }
    }

    private async onChangeAsync(event: React.FormEvent<HTMLInputElement>): Promise<void> {
        
        await this.valueChangeHandlerAsync(event);
        
        await this.invokeOnChangeAsync();
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
        if (value != this.str) {
            await this.updateValueAsync(value);

            this.focus();

            await this.invokeOnChangeAsync();
        }
    }
    
    private async clearAsync(): Promise<void> {
        if (this.str) {
            await this.updateValueAsync("");

            this.focus();

            await this.invokeOnChangeAsync();
        }
    }
    
    private get autoSuggestItems(): AutoSuggestItem[] {
        return this.props.autoSuggestItems ?? [];
    }
    
    private get toggleButtonId(): string {
        return `auto-suggest-toggler-${this.id}`;
    }
    
    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    protected getContainerClassName(): string {
        return styles.textInputContainer;
    }

    protected async onHideEditAsync(): Promise<void> {
        if (this.props.onChange) {
            await this.props.onChange(this, this.value, true, true);
        }
    }

    protected async valueBlurHandlerAsync(): Promise<void> {
        await super.valueBlurHandlerAsync();
        
        if (this.props.onBlur) {
            await this.props.onBlur(this);
        }
    }

    protected async clickHandlerAsync(): Promise<void> {
        if (this.props.onClick) {
            await this.props.onClick(this);
        }
    }

    public getValidators(): ValidatorCallback<string>[] {
        return [];
    }

    public focus(select: boolean = false): void {
        const inputElement: HTMLInputElement | HTMLTextAreaElement | null = this.inputElement;
        if (inputElement) {
            inputElement.focus();
            if (select) {
                inputElement.select();
            }
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
    
    public get clearButton(): boolean {
        return (this.props.clearButton === true);
    }

    public renderInput(): React.ReactNode {
        
        const value: string = this.str;
        const autoSuggestItems: AutoSuggestItem[] = this.autoSuggestItems;
        const hasAutoSuggestItems: boolean = (autoSuggestItems.length > 0);
        
        const noAutoComplete: boolean = this.noAutoComplete;
        const clearButton: boolean = (this.clearButton) && (!!value);

        const smallStyle: any = (this.props.small) && styles.small;
        const autoSuggestStyle: any = (hasAutoSuggestItems) && styles.autoSuggest;
        const clearButtonStyle: any = (clearButton) && styles.clearButton;
        const clearButtonWitchAutoSuggestStyle: any = (clearButton) && (hasAutoSuggestItems) && styles.autoSuggest;
        
        const inlineStyles: React.CSSProperties = {};
        if (this.props.width) {
            inlineStyles.width = this.props.width;
        }

        return (
            <React.Fragment>
                
                <input id={this.getInputId()}
                       type={this.getType()}
                       className={this.css(styles.textInput, "form-control", smallStyle, autoSuggestStyle, clearButtonStyle)}
                       style={inlineStyles}
                       title={TextInputLocalizer.get(this.props.title)}
                       placeholder={TextInputLocalizer.get(this.props.placeholder)}
                       value={value}
                       readOnly={this.readonly}
                       size={this.props.size || 10}
                       minLength={this.props.minLength || 0}
                       maxLength={this.props.maxLength || 255}
                       autoFocus={this.props.autoFocus}
                       autoComplete={noAutoComplete ? "off" : ""}
                       role={noAutoComplete ? "presentation" : ""}
                       onChange={(e: React.FormEvent<HTMLInputElement>) => this.onChangeAsync(e)}
                       onBlur={() => this.valueBlurHandlerAsync()}
                       onClick={() => this.clickHandlerAsync()}
                       onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => this.onInputKeyDownHandlerAsync(e)}
                />

                {
                    (clearButton) &&
                    (
                        <div className={this.css(styles.clearButtonIcon, clearButtonWitchAutoSuggestStyle)}>
                            <Icon stopPropagation
                                  name="fa fa-times"
                                  size={IconSize.Normal}
                                  onClick={() => this.clearAsync()}
                            />
                        </div>
                    )
                }

                {
                    (hasAutoSuggestItems) &&
                    (
                        <React.Fragment>
                            
                            <div className={this.css(styles.autoSuggestIcon)}>
                                <Icon id={this.toggleButtonId}
                                      stopPropagation
                                      name="fa fa-caret-down"
                                      size={IconSize.Normal}
                                      onClick={() => this.toggleAutoSuggest()}
                                />
                            </div>

                            <AutoSuggest ref={this._autoSuggestRef}
                                         items={autoSuggestItems}
                                         toggleButtonId={this.toggleButtonId}
                                         onSelect={(_, value) => this.setValueFromAutoSuggest(value)}
                            />
                            
                        </React.Fragment>
                    )
                }
                
            </React.Fragment>
        );
    }
}
