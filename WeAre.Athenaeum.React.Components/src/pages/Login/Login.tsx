import React from "react";
import {ApiProvider, PageRouteProvider} from "@weare/athenaeum-react-common";
import LoginRequest from "../../models/server/requests/LoginRequest";
import { LoginResultStatus } from "@/models/Enums";
import AnonymousPage from "../../models/base/AnonymousPage";
import PageContainer from "../../components/PageContainer/PageContainer";
import Form from "../../components/Form/Form";
import { IStringInputModel } from "@/components/Form/Inputs/BaseInput";
import PasswordInput from "../../components/Form/Inputs/PasswordInput/PasswordInput";
import Button, {ButtonType} from "../../components/Button/Button";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import { IconStyle } from "@/components/Icon/Icon";
import ButtonContainer from "../../components/ButtonContainer/ButtonContainer";
import PageDefinitions from "../../providers/PageDefinitions";
import TextInput from "@/components/Form/Inputs/TextInput/TextInput";
import EnumProvider from "@/providers/EnumProvider";
import Localizer from "../../localization/Localizer";

import styles from "./Login.module.scss";

export default class Login extends AnonymousPage {

    private _usernameInput: IStringInputModel = { value: "" };
    private _passwordInput: IStringInputModel = { value: "" };
    public _formRef: React.RefObject<any> = React.createRef();
     
    private async loginAsync(username: string, password: string): Promise<void> {
        
        const login = new LoginRequest(username, password);
        const loginResult: LoginResultStatus = await this.postAsync("api/Application/Login", login);
        
        if (loginResult !== LoginResultStatus.Success) {
            const form: Form | null = this._formRef.current;
            if (form != null) {
                const validationError: string = EnumProvider.getLoginResultStatusName(loginResult);
                await form.setValidationErrorsAsync(validationError);
            }
        }
    }

    public getTitle(): string {
        return Localizer.topNavLogin;
    }

    private async handleSubmitAsync(): Promise<void> {
        await this.loginAsync(this._usernameInput.value, this._passwordInput.value);
    }
    private async redirectToPasswordPage() {
        await PageRouteProvider.redirectAsync(PageDefinitions.forgotPasswordRoute);
    }

    private async onAzureClickAsync(): Promise<void> {
        window.location.href = await ApiProvider.invokeWithForcedSpinnerAsync(() => this.getAsync<string>("/api/Application/GetAzureSsoLogin"), true);
    }

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title={Localizer.loginPageTitle} subtitle={Localizer.loginPageSubtitle} className={styles.header}  />
                
                <PageRow>
                    <div className="col-lg-6">
                        
                        <Form id="form" onSubmit={async () => await this.handleSubmitAsync()} ref={this._formRef}>
                            
                            <TextInput id="username" label={Localizer.loginPageEmailInput} model={this._usernameInput} required />

                            <PasswordInput id="password" label={Localizer.loginPagePasswordInput} model={this._passwordInput} required />
                            
                            <ButtonContainer>
                                
                                <Button type={ButtonType.Orange} label={Localizer.loginPageLoginButton} submit />
                                
                                { 
                                    (!this.mobileApp) && 
                                    (
                                        <Button type={ButtonType.Blue} 
                                                icon={{ name: "windows", style: IconStyle.Brands }} 
                                                label={Localizer.loginPageSsoButton} 
                                                onClick={async () => await this.onAzureClickAsync()} 
                                        />
                                    )
                                }
                                
                                <Button label={Localizer.loginPageForgotPasswordButton} onClick={() => this.redirectToPasswordPage()}  />
                                
                            </ButtonContainer>
                            
                        </Form>
                    </div>
                </PageRow>
            </PageContainer>
        );
    }
}