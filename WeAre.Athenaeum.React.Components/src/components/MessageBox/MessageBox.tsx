import React from "react";
import ReactDOM from "react-dom";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IGlobalClick, IGlobalKeydown, IMessageBox, IMessageBoxButtons, MessageBoxModelCallback, DialogResult, MessageBoxButtons, MessageBoxIcon} from "@weare/athenaeum-react-common";
import Button, { ButtonType } from "../Button/Button";
import TextAreaInput from "../TextAreaInput/TextAreaInput";
import MessageBoxLocalizer from "./MessageBoxLocalizer";

import styles from "./MessageBox.module.scss";

interface IMessageBoxProps {
    minLength?: number;
    title?: string | IMessageBox | MessageBoxModelCallback;
    callback?(caller: MessageBox, dialogResult: DialogResult, comment: string): Promise<void>;
}

interface IMessageBoxState {
    isOpened: boolean;
    comment: string;
    processing: boolean;
}

export default class MessageBox extends BaseComponent<IMessageBoxProps, IMessageBoxState> implements IGlobalClick, IGlobalKeydown {

    private _model: IMessageBox | null = null;

    state: IMessageBoxState = {
        isOpened: false,
        comment: "",
        processing: false
    };

    private static _current: MessageBox | null = null;
    private static _previous: MessageBox | null = null;
    private readonly _commentRef: React.RefObject<TextAreaInput> = React.createRef();
    private _resolver: ((dialogResult: DialogResult) => void) | null = null;

    private toModel(titleOrModel: string | IMessageBox | MessageBoxModelCallback | undefined, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): IMessageBox {
        let model = {} as IMessageBox;

        let data: string | IMessageBox | MessageBoxModelCallback | undefined = titleOrModel;
        
        if (data) {

            if (typeof (data) === "function") {
                data = (data as () => string | IMessageBox)();
            }

            if (typeof (data) === "string") {
                model.title = data;
            } else {
                model = data;
            }
        }

        model.title = model.title || MessageBoxLocalizer.areYouSure;
        model.caption = caption || model.caption;
        model.icon = icon || model.icon;
        
        if (buttons) {
            if (typeof buttons === "object") {
                const initialized: boolean = !!buttons.okButton || !!buttons.cancelButton || !!buttons.abortButton || !!buttons.retryButton || !!buttons.ignoreButton || !!buttons.yesButton || !!buttons.noButton;
                if (initialized) {
                    model.buttons = MessageBoxButtons.Custom;
                    model.okButton = buttons.okButton;
                    model.cancelButton = buttons.cancelButton;
                    model.abortButton = buttons.abortButton;
                    model.retryButton = buttons.retryButton;
                    model.ignoreButton = buttons.ignoreButton;
                    model.yesButton = buttons.yesButton;
                    model.noButton = buttons.noButton;
                }
            } else {
                model.buttons = buttons;
            }
        }

        return model;
    }
    
    private getButtonLabel(button: string | boolean | undefined, def: string): string {
        return ((button) && (typeof button === "string")) ? button : def;
    }

    private get model(): IMessageBox {
        return this._model || (this._model = this.toModel(this.props.title));
    }

    private get buttons(): MessageBoxButtons {
        return this.model.buttons ?? MessageBoxButtons.OK;
    }
    
    private get hasOkButton(): boolean {
        return (!!this.model.okButton) || (this.buttons == MessageBoxButtons.OK) || (this.buttons == MessageBoxButtons.OKCancel);
    }
    
    private get hasCancelButton(): boolean {
        return (!!this.model.cancelButton) || (this.buttons == MessageBoxButtons.OKCancel) || (this.buttons == MessageBoxButtons.YesNoCancel) || (this.buttons == MessageBoxButtons.RetryCancel);
    }
    
    private get hasYesButton(): boolean {
        return (!!this.model.yesButton) || (this.buttons == MessageBoxButtons.YesNo) || (this.buttons == MessageBoxButtons.YesNoCancel);
    }
    
    private get hasNoButton(): boolean {
        return (!!this.model.noButton) || (this.buttons == MessageBoxButtons.YesNo) || (this.buttons == MessageBoxButtons.YesNoCancel);
    }
    
    private get hasAbortButton(): boolean {
        return (!!this.model.abortButton) || (this.buttons == MessageBoxButtons.AbortRetryIgnore);
    }
    
    private get hasRetryButton(): boolean {
        return (!!this.model.retryButton) || (this.buttons == MessageBoxButtons.AbortRetryIgnore) || (this.buttons == MessageBoxButtons.RetryCancel);
    }
    
    private get hasIgnoreButton(): boolean {
        return (!!this.model.ignoreButton) || (this.buttons == MessageBoxButtons.AbortRetryIgnore);
    }

    private get hasComment(): boolean {
        return (this.state.isOpened)
            ? !!this.model.comment
            : false;
    }

    private get minLength(): number {
        return (this.state.isOpened)
            ? this.props.minLength || this.model.minLength || 0
            : 0;
    }

    private get canConfirm(): boolean {
        return ((!this.hasComment) || (this.state.comment.length > this.minLength));
    }

    private get processing(): boolean {
        return this.state.processing;
    }

    private async setCommentAsync(comment: string): Promise<void> {
        await this.setState({ comment });
    }

    private async setDialogAsync(isOpened: boolean, nestedCheck: boolean = true): Promise<void> {
        if ((this.isMounted) && (this.state.isOpened != isOpened)) {

            if (nestedCheck) {
                if ((isOpened) && (MessageBox._current)) {
                    await MessageBox._current.setDialogAsync(false, false);
                    MessageBox._previous = MessageBox._current;
                }
            }

            await this.setState({isOpened});

            if (nestedCheck) {
                MessageBox._current = (isOpened) ? this : null;
                if ((!isOpened) && (MessageBox._previous)) {
                    await MessageBox._previous.setDialogAsync(true, false);
                    MessageBox._previous = null;
                }
            }
        }
    }

    private async setProcessingAsync(processing: boolean): Promise<void> {
        if (this.isMounted) {
            await this.setState({ processing });
        }
    }

    private async invokeCloseAsync(dialogResult: DialogResult): Promise<void> {

        if (this.props.callback) {
            if (!this.processing) {
                try {
                    await this.setProcessingAsync(true);
                    await this.props.callback(this, dialogResult, this.state.comment);
                } finally {
                    await this.setProcessingAsync(false);
                }
            }
        }

        if (this._resolver) {
            this._resolver(dialogResult);
            this._resolver = null;
        }

        await this.setDialogAsync(false);
    }

    public async toggleAsync(): Promise<void> {
        if (this.state.isOpened) {
            await this.invokeCloseAsync(DialogResult.None);
        } else {
            await this.openAsync();
        }
    }

    public async openAsync(): Promise<void> {
        await this.setDialogAsync(true);

        if (this._commentRef.current) {
            this._commentRef.current!.focus();
        }
    }

    public async closeAsync(): Promise<void> {
        await this.invokeCloseAsync(DialogResult.None);
    }
    
    public async showAsync(titleOrModel: string | IMessageBox | MessageBoxModelCallback, caption?: string, buttons?: MessageBoxButtons | IMessageBoxButtons, icon?: MessageBoxIcon): Promise<DialogResult> {

        this._model = this.toModel(titleOrModel, caption, buttons, icon);

        await this.openAsync();

        return new Promise((resolve) => {
            this._resolver = resolve;
        });
    }

    public async onGlobalClick(e: React.MouseEvent): Promise<void> {
        const targetNode = e.target as Node;

        const outside: boolean = Utility.clickedOutside(targetNode, `messageBox-${this.id}`);

        if (outside) {
            await this.invokeCloseAsync(DialogResult.None);
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if (!this.hasComment) {
            await this.invokeCloseAsync(DialogResult.None);
        } else {
            if (e.keyCode === 27) {
                await this.invokeCloseAsync(DialogResult.None);
            }
        }
    }

    public async componentWillReceiveProps(nextProps: IMessageBoxProps): Promise<void> {
        this._model = null;

        await super.componentWillReceiveProps(nextProps);
    }

    private renderDialog(): React.ReactNode {
        const openedStyle: any = (this.state.isOpened) && styles.opened;
        const processingStyle: any = (this.processing) && styles.processing;
        
        return (
            <div id={"confirmation-dialog" + this.id} className={this.css(styles.messageBox, openedStyle, processingStyle)}>

                <div className={styles.dialogOverlay} />

                <div className={styles.dialogContent} id={`messageBox-${this.id}`}>

                    <h5>{this.toMultiLines(this.model.title)}</h5>

                    {
                        (this.hasComment) &&
                        (
                            <TextAreaInput ref={this._commentRef}
                                           required noValidate
                                           rows={3}
                                           placeholder={this.model.placeholder || MessageBoxLocalizer.comment}
                                           className={styles.commentInput}
                                           value={this.state.comment}
                                           readonly={this.processing}
                                           onChange={async (sender, value) => await this.setCommentAsync(value)}
                            />
                        )
                    }
                    
                    {
                        (this.hasOkButton) &&
                        (
                            <Button block
                                    id={"message-box-ok" + this.id}
                                    label={this.getButtonLabel(this.model.okButton, MessageBoxLocalizer.ok)}
                                    type={ButtonType.Orange}
                                    disabled={this.processing || !this.canConfirm}
                                    onClick={() => this.invokeCloseAsync(DialogResult.OK)}
                            />
                        )
                    }

                    {
                        (this.hasYesButton) &&
                        (
                            <Button block
                                    id={"message-box-yes" + this.id}
                                    label={this.getButtonLabel(this.model.yesButton, "EN: Yes")}
                                    type={ButtonType.Orange}
                                    disabled={this.processing || !this.canConfirm}
                                    onClick={() => this.invokeCloseAsync(DialogResult.Yes)}
                            />
                        )
                    }

                    {
                        (this.hasAbortButton) &&
                        (
                            <Button block
                                    id={"message-box-abort" + this.id}
                                    label={this.getButtonLabel(this.model.abortButton, "EN: Abort")}
                                    type={ButtonType.Orange}
                                    disabled={this.processing}
                                    onClick={() => this.invokeCloseAsync(DialogResult.Abort)}
                            />
                        )
                    }

                    {
                        (this.hasRetryButton) &&
                        (
                            <Button block
                                    id={"message-box-retry" + this.id}
                                    label={this.getButtonLabel(this.model.retryButton, "EN: Retry")}
                                    type={ButtonType.Orange}
                                    disabled={this.processing || !this.canConfirm}
                                    onClick={() => this.invokeCloseAsync(DialogResult.Retry)}
                            />
                        )
                    }

                    {
                        (this.hasIgnoreButton) &&
                        (
                            <Button block
                                    id={"message-box-ignore" + this.id}
                                    label={this.getButtonLabel(this.model.ignoreButton, "EN: Ignore")}
                                    type={ButtonType.Default}
                                    disabled={this.processing}
                                    onClick={() => this.invokeCloseAsync(DialogResult.Ignore)}
                            />
                        )
                    }

                    {
                        (this.hasNoButton) &&
                        (
                            <Button block
                                    id={"message-box-no" + this.id}
                                    label={this.getButtonLabel(this.model.noButton, "EN: No")}
                                    type={ButtonType.Default}
                                    disabled={this.processing || !this.canConfirm}
                                    onClick={() => this.invokeCloseAsync(DialogResult.No)}
                            />
                        )
                    }

                    {
                        (this.hasCancelButton) &&
                        (
                            <Button block
                                    id={"message-box-no" + this.id}
                                    label={this.getButtonLabel(this.model.cancelButton, "EN: Cancel")}
                                    type={ButtonType.Default}
                                    disabled={this.processing || !this.canConfirm}
                                    onClick={() => this.invokeCloseAsync(DialogResult.Cancel)}
                            />
                        )
                    }

                </div>

            </div>
        )
    }

    public render(): React.ReactNode {
        return ReactDOM.createPortal(this.renderDialog(), document.body);
    }
}