import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import Form from "../Form/Form";
import PasswordInput from "../Form/Inputs/PasswordInput/PasswordInput";
import ButtonContainer from "../ButtonContainer/ButtonContainer";
import { IStringInputModel } from "../Form/Inputs/BaseInput";
import Button, { ButtonType } from "../Button/Button";
import { PasswordValidationRule } from "@/models/Enums";
import { ValidationRow } from "../Form/Inputs/PasswordInput/LiveValidator/LiveValidator";
import Localizer from "../../localization/Localizer";

export enum PasswordFormType {
    SetPassword,
    
    ChangePassword
}

interface IPasswordFormProps {
    type?: PasswordFormType;
    onSubmit(newPassword: string, oldPassword: string): Promise<void>;
}

export default class PasswordForm extends BaseComponent<IPasswordFormProps> {
    public currentPassword: IStringInputModel = { value: "" };
    public password: IStringInputModel = { value: "" };
    public passwordConfirmation: IStringInputModel = { value: "" };

    private readonly _formRef: React.RefObject<any> = React.createRef();   
    
    private get validationRows(): ValidationRow[] {
        const validationRows: ValidationRow[] = [
                new ValidationRow(PasswordValidationRule.UpperCaseCharacter, Localizer.passwordHelpTextUpperCase),
                new ValidationRow(PasswordValidationRule.LowerCaseCharacter,  Localizer.passwordHelpTextLowerCase),
                new ValidationRow(PasswordValidationRule.NumberCharacter,  Localizer.passwordHelpTextNumber),
                new ValidationRow(PasswordValidationRule.SpecialCharacter,  Localizer.passwordHelpTextSpecialCharacter)
            ];
        
        return validationRows;
    }

    public async handleSubmitAsync(): Promise<void> {       
        if(this.password.value != this.passwordConfirmation.value){
            const form: Form = this._formRef.current!;
            const validationError: string = Localizer.resetPasswordPasswordsDontMatchMessage;
            await form.setValidationErrorsAsync(validationError);
        }
        else {
            if (this.props.type == PasswordFormType.SetPassword) {
                await this.props.onSubmit(this.password.value, "");
            }
            if (this.props.type == PasswordFormType.ChangePassword) {
                await this.props.onSubmit(this.passwordConfirmation.value, this.currentPassword.value);
            }
            
        }
    }
    
    render(): React.ReactNode {
        
        return (
            <React.Fragment>
                <Form id="form" ref={this._formRef} onSubmit={async () => await this.handleSubmitAsync()}>                            
                    {
                        (this.props.type == PasswordFormType.ChangePassword) &&
                        <PasswordInput label={Localizer.changePasswordCurrentPassword} model={this.currentPassword} required />                                     
                    }                            
                    <PasswordInput label={Localizer.loginPagePasswordInput} model={this.password} liveValidator={this.validationRows} validLength={8} required />
                    <PasswordInput label={Localizer.resetPasswordConfirmPasswordInput} model={this.passwordConfirmation} required />
    
                    <ButtonContainer>
                        <Button type={ButtonType.Orange} label={Localizer.formSave} submit />
                    </ButtonContainer>
                </Form>
            </React.Fragment>
        );
    }
}