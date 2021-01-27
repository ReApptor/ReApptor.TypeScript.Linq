import React from "react";
import BasePasswordPage from "../ChangePassword/BasePasswordPage";
import {PasswordFormType} from "@/components/PasswordForm/PasswordForm";
import Localizer from "../../localization/Localizer";

export default class ResetPassword extends BasePasswordPage {

    protected get passwordType(): PasswordFormType {
        return PasswordFormType.SetPassword;
    }
    
    public getTitle(): string {
        return Localizer.resetPasswordPageTitle;
    }
}