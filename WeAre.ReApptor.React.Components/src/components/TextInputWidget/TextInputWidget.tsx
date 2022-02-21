import React from "react";
import BaseInputWidget, { IBaseInputWidgetProps, IInputRefType } from "../WidgetContainer/BaseInputWidget";

import styles from "../WidgetContainer/WidgetContainer.module.scss";
import AutoSuggest, { AutoSuggestItem } from "../TextInput/AutoSuggest/AutoSuggest";

interface ITextInputWidgetProps extends IBaseInputWidgetProps {
    autoSuggestItems?: AutoSuggestItem[];
    autoComplete?: boolean;
}

export default class TextInputWidget extends BaseInputWidget<ITextInputWidgetProps> {
    private readonly _autoSuggestRef: React.RefObject<AutoSuggest> = React.createRef();

    private async setValueFromAutoSuggest(value: string): Promise<void> {
        await this.setAsync(value);
    }

    private get autoSuggestItems(): any[] {
       return this.props.autoSuggestItems ? this.props.autoSuggestItems : [];
    }

    private get toggleButtonId(): string {
        return `auto-suggest-toggler-${this.id}`;
    }
    
    protected  refObject: IInputRefType<HTMLInputElement> = {
        _inputRef: React.createRef()
    };

    protected get input(): HTMLInputElement {
        return this.refObject._inputRef.current!;
    }

    protected renderContent(renderHidden: boolean = false): React.ReactNode {
        let fontSize: object = {fontSize: "2em"};

        if (this.value.length > 17) {
            fontSize = {fontSize: "1.5em"};
        }
        if (this.value.length > 44) {
            fontSize = {fontSize: "1em"};
        }

        return (
            <div className={styles.textInput}>

                {
                    (this.inputVisible)
                        ?
                        (
                            <React.Fragment>
                                <div className={styles.inputContainer}>
                                    <input
                                        id={this.inputId}
                                        type="text"
                                        ref={this.refObject._inputRef}
                                        value={this.value}
                                        onChange={async (e: React.FormEvent<HTMLInputElement>) => await this.onInputChangeHandlerAsync(e)}
                                        onKeyUp={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyUpHandlerAsync(e)}
                                        className="form-control"
                                        autoComplete={(this.props.autoComplete === false) ? "off" : ""}
                                    />

                                    {
                                        (this.autoSuggestItems.length > 0) && (
                                            <div className={this.css(styles.autoCompleteContainer, this.mobile && styles.mobile)}>
                                                <AutoSuggest ref={this._autoSuggestRef}
                                                             className={styles.autoComplete}
                                                             items={this.autoSuggestItems}
                                                             isOpen={this.inputVisible}
                                                             toggleButtonId={this.toggleButtonId}
                                                             onSelect={async (_, value) => await this.setValueFromAutoSuggest(value)}/>
                                            </div>
                                        )
                                    }
                                </div>
                            </React.Fragment>
                        )
                        :
                        (
                            <div onClick={async () => await this.showInputAsync()}>
                                {this.value ? <div className={styles.valueContainer}><span style={fontSize}>{this.value}</span></div> : super.renderContent(renderHidden)}
                            </div>
                        )
                }

            </div>
        );
    }
};
