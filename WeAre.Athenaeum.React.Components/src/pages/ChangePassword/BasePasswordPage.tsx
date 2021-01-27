import React from "react";
import AuthorizedPage from "../../models/base/AuthorizedPage";
import PasswordForm, {PasswordFormType} from "../../components/PasswordForm/PasswordForm";
import PageContainer from "../../components/PageContainer/PageContainer";
import PageHeader from "../../components/PageContainer/PageHeader/PageHeader";
import PageRow from "../../components/PageContainer/PageRow/PageRow";
import ChangePasswordRequest from "../../models/server/requests/ChangePasswordRequest";
import SetPasswordRequest from "../../models/server/requests/SetPasswordRequest";
import User from "../../models/server/User";

export default abstract class BasePasswordPage extends AuthorizedPage {

    protected get passwordType(): PasswordFormType {
        const user: User = this.getUser();
        return (user.hasPassword) ? PasswordFormType.ChangePassword : PasswordFormType.SetPassword;
    }

    private async changePasswordAsync(password: string, oldPassword: string): Promise<void> {
        if (this.passwordType == PasswordFormType.SetPassword) {
            const request = new SetPasswordRequest(password);
            await this.postAsync("api/Application/SetPassword", request);
        } else {
            let request = new ChangePasswordRequest(password, oldPassword);
            await this.postAsync("api/Application/ChangePassword", request);
        }
    }
    
    public async initializeAsync(): Promise<void> {
    }

    // protected abstract getTitle(): string;

    public render(): React.ReactNode {
        return (
            <PageContainer>
                <PageHeader title={this.getTitle()}/>
                <PageRow>
                    <div className="col-lg-6">
                        <PasswordForm type={this.passwordType}
                                      onSubmit={(newPassword, oldPassword) => this.changePasswordAsync(newPassword, oldPassword)}
                        />
                    </div>
                </PageRow>
            </PageContainer>
        );
    }
}