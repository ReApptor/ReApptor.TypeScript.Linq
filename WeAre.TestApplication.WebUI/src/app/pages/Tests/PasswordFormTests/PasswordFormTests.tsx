import React from "react";
import {BaseComponent, DocumentPreviewSize} from "@weare/reapptor-react-common";
import {PasswordForm, PasswordFormType} from "@weare/reapptor-react-components";

interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
}

export default class PasswordFormTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium
    };
    private _formRef: React.RefObject<PasswordForm> = React.createRef();

    private async handleSubmitAsync(newPassword: string, oldPassword: string): Promise<void> {
       console.log(newPassword, oldPassword);
       await this.reRenderAsync();
    }
    
    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <PasswordForm ref={this._formRef}
                              type={PasswordFormType.ChangePassword}
                              onSubmit={async (newPassword, oldPassword) => await this.handleSubmitAsync(newPassword, oldPassword)}
                />
            </React.Fragment>
        );
    }
}