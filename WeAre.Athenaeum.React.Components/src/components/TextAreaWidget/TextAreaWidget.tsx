import React from "react";
import TextInputWidget, { IBaseInputWidgetProps, IInputRefType } from "../WidgetContainer/BaseInputWidget";

import styles from "../WidgetContainer/WidgetContainer.module.scss";

export default class TextAreaWidget extends TextInputWidget<IBaseInputWidgetProps> {
    public refObject: IInputRefType<HTMLTextAreaElement> = {
        _inputRef: React.createRef()
    };

    // public get minimized(): boolean {
    //     return this.mobile || this.state.minimized;
    // }

    protected renderContent(): React.ReactNode {
        let fontSize: object = { fontSize: "2em" };

        if(this.value.length > 17) {
            fontSize = { fontSize: "1.5em" };
        }
        if(this.value.length > 44) {
            fontSize = { fontSize: "1em" };
        }
        
        return (
            <div className={styles.textInput}>
                {
                    this.inputVisible ? (
                        <div className={styles.inputContainer}>
                            <textarea
                                id={this.inputId}
                                ref={this.refObject._inputRef}
                                value={this.value}
                                onChange={async (e: React.FormEvent<HTMLTextAreaElement>) => await this.onInputChangeHandlerAsync(e)}
                                onKeyUp={async (e: React.KeyboardEvent<HTMLTextAreaElement>) => await this.onInputKeyUpHandlerAsync(e)}
                                className="form-control"
                                rows={this.props.rows || 3}/>
                        </div>

                    ) : (
                        <div onClick={async () => await this.showInputAsync()}>
                            { this.value ? <div className={styles.valueContainer}><span style={fontSize}>{this.value}</span></div> : super.renderContent() }
                        </div>
                    )
                }
            </div>
        )
    }
}