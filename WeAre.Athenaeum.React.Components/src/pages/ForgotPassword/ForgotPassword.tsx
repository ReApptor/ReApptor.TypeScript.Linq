import React from "react";
import {PageRouteProvider} from "@weare/athenaeum-react-common";
import { LoginResultStatus } from "@/models/Enums";
import AnonymousPage from "../../models/base/AnonymousPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import Form from "../../components/Form/Form";
import { IStringInputModel } from "@/components/Form/Inputs/BaseInput";
import Button, {ButtonType} from "../../components/Button/Button";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import ButtonContainer from "../../components/ButtonContainer/ButtonContainer";
import PageDefinitions from "../../providers/PageDefinitions";
import ForgotPasswordRequest from "../../models/server/requests/ForgotPasswordRequest";
import TextInput from "@/components/Form/Inputs/TextInput/TextInput";
import Localizer from "../../localization/Localizer";

import styles from "./ForgotPassword.module.scss";

export default class ForgotPassword extends AnonymousPage {

    public _usernameInput: IStringInputModel = { value: "" };
    public _formRef: React.RefObject<any> = React.createRef();

    public getTitle(): string {
        return Localizer.forgotPasswordPagePageTitle;
    }

    private async handleSubmitAsync(): Promise<void> {
        const request = new ForgotPasswordRequest(this._usernameInput.value);
        await this.postAsync<LoginResultStatus>("api/Application/ForgotPassword", request);
    }

    private async redirectToLoginPage() {
        await PageRouteProvider.redirectAsync(PageDefinitions.loginRoute);
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title={Localizer.forgotPasswordPagePageTitle} subtitle={Localizer.forgotPasswordPageHelpText} className={styles.header}  />

                <PageRow>
                    <div className="col-lg-6">

                        <Form id="form" onSubmit={async () => await this.handleSubmitAsync()} ref={this._formRef}>
                            <TextInput id="username" label={Localizer.forgotPasswordUsernameInput} model={this._usernameInput} required />

                            <ButtonContainer>
                                <Button type={ButtonType.Orange} label={Localizer.forgotPasswordPageResetButton} submit />
                                <Button type={ButtonType.Default} label={Localizer.forgotPasswordPageLoginButton} onClick={() => this.redirectToLoginPage()} />
                            </ButtonContainer>

                        </Form>
                    </div>
                </PageRow>
            </PageContainer>
        );
    }
}