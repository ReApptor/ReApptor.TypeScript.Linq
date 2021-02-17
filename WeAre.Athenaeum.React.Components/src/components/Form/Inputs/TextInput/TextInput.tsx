import React from "react";
import BaseInput, {ValidatorCallback, IBaseInputProps, IBaseInputState} from "../BaseInput";
import { BaseInputType  } from "@/models/Enums";
import AutoSuggest, { AutoSuggestItem } from "./AutoSuggest/AutoSuggest";
import Localizer from "../../../../localization/Localizer";

import styles from "./TextInput.module.scss";

export interface ITextInputProps extends IBaseInputProps<string> {
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
    autoComplete?: boolean;
    onChange?(sender: TextInput, value: string, userInteraction: boolean, done: boolean): Promise<void>;
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
        
        if(autoSuggest) {
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

    public renderInput(): React.ReactNode {
        
        const smallStyle: any = (this.props.small) && styles.small;
        
        const autoSuggestStyle: any = (this.autoSuggestItems.length) && styles.autoSuggest;

        const inlineStyles: React.CSSProperties = {};

        if (this.props.width) {
            inlineStyles.width = this.props.width;
        }
        
        return (
            <React.Fragment>
                <input
                    id={this.getInputId()}
                    type={this.getType()}
                    value={this.str}
                    title={this.props.title}
                    readOnly={this.readonly}
                    onChange={async (e: React.FormEvent<HTMLInputElement>) => await this.onChangeAsync(e)}
                    onBlur={async () => await this.valueBlurHandlerAsync()}
                    onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyDownHandlerAsync(e)}
                    className={this.css(styles.textInput, "form-control", smallStyle, autoSuggestStyle)}
                    style={inlineStyles}
                    size={this.props.size || 10}
                    maxLength={this.props.maxLength || 255}
                    placeholder={Localizer.get(this.props.placeholder)}
                    autoFocus={this.props.autoFocus}
                    autoComplete={(this.props.autoComplete === false) ? "off" : ""}
                />
                
                {
                    (this.autoSuggestItems.length > 0) &&
                    (
                        <React.Fragment>
                            <i id={this.toggleButtonId} className={this.css(styles.icon, "fa fa-caret-down")} onClick={async () => await this.toggleAutoSuggest()} />

                            <AutoSuggest ref={this._autoSuggestRef}
                                         items={this.autoSuggestItems} 
                                         toggleButtonId={this.toggleButtonId}
                                         onSelect={async (_, value) => await this.setValueFromAutoSuggest(value) } />
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        );
    }
}