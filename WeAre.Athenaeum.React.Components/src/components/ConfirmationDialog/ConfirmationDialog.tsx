import React from "react";
import ReactDOM from "react-dom";
import {Utility} from "@weare/athenaeum-toolkit";
import {BaseComponent, IGlobalClick, IGlobalKeydown} from "@weare/athenaeum-react-common";
import Button, { ButtonType } from "../Button/Button";
import TextAreaInput from "@/components/Form/Inputs/TextAreaInput/TextAreaInput";

import styles from "./ConfirmationDialog.module.scss";

export type ConfirmationDialogTitleCallback = () => string | IConfirmation;

export interface IConfirmation {
    title: string;
    placeholder?: string;
    minLength?: number;
    comment?: boolean;
}

interface IConfirmationDialogProps {
    minLength?: number;
    title?: string | IConfirmation | ConfirmationDialogTitleCallback;
    callback?(caller: ConfirmationDialog, data: string): Promise<void>;
    onDecline?(caller: ConfirmationDialog): Promise<void>;
}

interface IConfirmationDialogState {
    isOpened: boolean;
    comment: string;
}

export default class ConfirmationDialog extends BaseComponent<IConfirmationDialogProps, IConfirmationDialogState> implements IGlobalClick, IGlobalKeydown {

    private _model: IConfirmation | null = null;
    private _processing: boolean = false;
    
    state: IConfirmationDialogState = {
        isOpened: false,
        comment: ""
    };

    private readonly _commentRef: React.RefObject<TextAreaInput> = React.createRef();
    private _resolver: ((confirmed: boolean) => void) | null = null;
    
    private toModel(title: string | IConfirmation | ConfirmationDialogTitleCallback | undefined): IConfirmation {
        let model = {} as IConfirmation;

        let data: string | IConfirmation | ConfirmationDialogTitleCallback | undefined = title;
        if (data) {

            if (typeof (data) === "function") {
                data = (data as () => string | IConfirmation)();
            }

            if (typeof (data) === "string") {
                model.title = data;
            } else {
                model = data;
            }
        }

        if (!model.title) {
            model.title = this.localizer.get("Component.ConfirmationDialog.AreYouSure");
        }
        
        return model;
    }

    private get model(): IConfirmation {
        return this._model || (this._model = this.toModel(this.props.title));
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

    private async setCommentAsync(comment: string): Promise<void> {
        await this.setState({ comment });
    }

    private async setDialogAsync(isOpened: boolean): Promise<void> {
        if (this.isMounted) {
            await this.setState({isOpened});
        }
    }

    private async invokeCloseAsync(confirm: boolean = false): Promise<void> {

        if (confirm) {
            if (this.props.callback) {
                if (!this._processing) {
                    try {
                        this._processing = true;
                        await this.props.callback(this, this.state.comment);
                    } finally {
                        this._processing = false;
                    }
                }
            }
        } else if (this.props.onDecline) {
            await this.props.onDecline(this);
        }

        if (this._resolver) {
            this._resolver(confirm);
            this._resolver = null;
        }

        await this.setDialogAsync(false);
    }
    
    public async toggleAsync(): Promise<void> {
        if (this.state.isOpened) {
            await this.invokeCloseAsync();
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
        await this.invokeCloseAsync();
    }

    public async confirmAsync(title: string | IConfirmation | ConfirmationDialogTitleCallback): Promise<boolean> {
        
        this._model = this.toModel(title);
        
        await this.openAsync();
        
        return new Promise((resolve) => {
            this._resolver = resolve;
        });
    }
    
    public async onGlobalClick(e: React.MouseEvent): Promise<void> {
        const targetNode = e.target as Node;

        const outside = Utility.clickedOutside(targetNode, `confirmationContent-${this.id}`);

        if (outside) {
            await this.invokeCloseAsync();
        }
    }

    public async onGlobalKeydown(e: React.KeyboardEvent): Promise<void> {
        if (!this.hasComment) {
            await this.invokeCloseAsync();
        } else {
            if (e.keyCode === 27) {
                await this.invokeCloseAsync();
            }
        }
    }

    public async componentWillReceiveProps(nextProps: IConfirmationDialogProps): Promise<void> {
        
        this._model = null;
        
        await super.componentWillReceiveProps(nextProps);
    }

    private renderDialog(): React.ReactNode {
        return (
            <div id={this.id} className={this.css(styles.confirmDialog, this.state.isOpened && styles.opened)}>

                <div className={styles.dialogOverlay} />

                <div className={styles.dialogContent} id={`confirmationContent-${this.id}`}>

                    <h5>{this.toMultiLines(this.model.title)}</h5>

                    {
                        (this.hasComment) &&
                        (
                            <TextAreaInput ref={this._commentRef}
                                           required noValidate
                                           rows={3}
                                           placeholder={this.model.placeholder || this.localizer.get("ConfirmationDialog.Comment")}
                                           className={styles.commentInput}
                                           value={this.state.comment}
                                           onChange={async (sender, value) => await this.setCommentAsync(value)}
                            />
                        )
                    }

                    <Button label={this.localizer.get("ConfirmationDialog.Confirm")} block type={ButtonType.Orange} onClick={() => this.invokeCloseAsync(true)} disabled={!this.canConfirm} />
                    <Button label={this.localizer.get("ConfirmationDialog.Close")} block type={ButtonType.Default} onClick={() => this.invokeCloseAsync()} />

                </div>

            </div>
        )
    }
    
    public render(): React.ReactNode {
        return ReactDOM.createPortal(this.renderDialog(), document.body);
    }
}