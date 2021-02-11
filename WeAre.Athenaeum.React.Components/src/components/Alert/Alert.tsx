import React from "react";
import {ILocalizer, ServiceProvider, Utility} from "@weare/athenaeum-toolkit";
import {AlertModel, AlertType, BaseComponent} from "@weare/athenaeum-react-common";
import AthenaeumComponentsConstants from "@/AthenaeumComponentsConstants";

import styles from "./Alert.module.scss";

export interface IAlertProps {
    className?: string;
    model: AlertModel;
    onClose?(sender: Alert, userInteraction: boolean): Promise<void>;
}

export default class Alert extends BaseComponent<IAlertProps> {
    
    private async closeAlertAsync(userInteraction: boolean): Promise<void> {
        if (this.props.onClose) {
            await this.props.onClose(this, userInteraction);
        }
    }

    private async closeWithDelayAsync(): Promise<void> {
        await Utility.wait(AthenaeumComponentsConstants.alertCloseDelay);
        
        this.fadeOut();
        
        await this.closeAlertAsync(false);
    }
    
    private fadeOut(): void {
        const alertNode: JQuery = this.getNode();
        alertNode.addClass(styles.fadeOut);
    }

    private getAlertType(): string {
        switch (this.model.alertType) {
            case AlertType.Success:
                return "alert-success";
            case AlertType.Warning:
                return "alert-warning";
            case AlertType.Danger:
                return "alert-danger";
            case AlertType.Primary:
                return "alert-primary";
            case AlertType.Secondary:
                return "alert-secondary";
            case AlertType.Light:
                return "alert-light";
            case AlertType.Dark:
                return "alert-dark";

            default:
                return "alert-info";
        }
    }
    
    public async componentDidMount(): Promise<void> {
        await super.componentDidMount();
        
        if (this.model.autoClose) {
            await this.closeWithDelayAsync();
        }
    }
    
    public get model(): AlertModel {
        return this.props.model;
    }

    public render(): React.ReactNode {        
        return (
            <div id={this.id} className={this.css((this.model.flyout && styles.flyout), styles.alert, "alert", this.getAlertType(), this.props.className)}>
                <span className={styles.message}>
                    
                    {
                        (this.model.dismissible) &&
                        (
                            <div className={this.css(styles.close)} onClick={async () => await this.closeAlertAsync(true)}>
                                <span>&times;</span>
                            </div>
                        )
                    }

                    {
                        this.toMultiLines(this.localizer.get(this.model.message, ...(this.model.messageParams || [])))
                    }
                    
                </span>
            </div>
        );
    }
}