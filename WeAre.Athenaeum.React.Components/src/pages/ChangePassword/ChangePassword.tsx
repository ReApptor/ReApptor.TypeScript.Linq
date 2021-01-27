import React from "react";
import BasePasswordPage from "./BasePasswordPage";
import Localizer from "../../localization/Localizer";

export default class ChangePassword extends BasePasswordPage {

    public getTitle(): string {
        return Localizer.changePasswordPageTitle;
    }
    
}