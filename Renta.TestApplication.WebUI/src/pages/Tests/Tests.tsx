import {AlertModel, AlertType, ApplicationContext, BasePage} from "@weare/athenaeum-react-common";
import React from "react";
import styles from "./Tests.module.scss";
import {Alert} from "@weare/athenaeum-react-components";

import AlertTests from "@/pages/Tests/AlertTests/AlertTests";

export default class Tests<TProps, TState> extends BasePage<TProps, TState, ApplicationContext> {

    get alertModel(): AlertModel {
        return {
            alertType: AlertType.Success, autoClose: false, autoCloseDelay: 0, dismissible: true, flyout: false, isAlertModel: false, messageParams: [],
            message : "Test 123"
        };
    }
    
    public getTitle(): string {
        return "Tests";
    }

    public render(): React.ReactNode {
        return (
            <div className={this.css(styles.page)} id={this.id}>
                <div className={this.css("container", styles.container, styles.fullHeight, styles.fullWidth)}>
                    <Alert model={this.alertModel} />
                    <AlertTests/>
                </div>
        </div> 
        )
    }

}