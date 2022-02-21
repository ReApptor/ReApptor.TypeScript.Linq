import React from "react";
import {BaseComponent, PasswordValidationRule} from "@weare/athenaeum-react-common";
import PasswordFormLocalizer from "./PasswordFormLocalizer";
import {ValidationRow} from "../PasswordInput/LiveValidator/LiveValidator";
import {IStringInputModel} from "../BaseInput/BaseInput";
import Form from "../Form/Form";
import PasswordInput from "../PasswordInput/PasswordInput";
import ButtonContainer from "../ButtonContainer/ButtonContainer";
import Button, {ButtonType} from "../Button/Button";

export enum PasswordFormType {
    SetPassword,
    
    ChangePassword
}

interface IPasswordFormProps {
    type?: PasswordFormType;
    onSubmit(newPassword: string, oldPassword: string): Promise<void>;
}

export default class PasswordForm extends BaseComponent<IPasswordFormProps> {
    public currentPassword: IStringInputModel = {value: ""};
    public password: IStringInputModel = {value: ""};
    public passwordConfirmation: IStringInputModel = {value: ""};

    private readonly _formRef: React.RefObject<any> = React.createRef();
   
    private readonly validationRows = [ 
        new ValidationRow(PasswordValidationRule.UpperCaseCharacter, PasswordFormLocalizer.helpTextUpperCase),
        new ValidationRow(PasswordValidationRule.LowerCaseCharacter, PasswordFormLocalizer.helpTextLowerCase),
        new ValidationRow(PasswordValidationRule.NumberCharacter, PasswordFormLocalizer.helpTextNumber),
        new ValidationRow(PasswordValidationRule.SpecialCharacter, PasswordFormLocalizer.helpTextSpecialCharacter)
    ];
 

    public async handleSubmitAsync(): Promise<void> {
        if (this.password.value != this.passwordConfirmation.value) {
            const form: Form = this._formRef.current!;
            const validationError: string = PasswordFormLocalizer.resetPasswordPasswordsDontMatchMessage;
            await form.setValidationErrorsAsync(validationError);
        } else {
            if (this.props.type == PasswordFormType.SetPassword) {
                await this.props.onSubmit(this.password.value, "");
            }
            if (this.props.type == PasswordFormType.ChangePassword) {
                await this.props.onSubmit(this.passwordConfirmation.value, this.currentPassword.value);
            }
        }
    }

    public render(): React.ReactNode {

        const changePassword: boolean = (this.props.type == PasswordFormType.ChangePassword);
        return (
            <React.Fragment>
                <Form id="form" ref={this._formRef} onSubmit={() => this.handleSubmitAsync()}>

                    {
                        (changePassword) &&
                        (
                            <PasswordInput required autoFocus
                                           label={PasswordFormLocalizer.changePasswordCurrentPassword}
                                           model={this.currentPassword}
                            />
                        )
                    }

                    <PasswordInput required
                                   autoFocus={!changePassword}
                                   validLength={8}
                                   label={PasswordFormLocalizer.loginPagePasswordInput}
                                   model={this.password}
                                   liveValidator={this.validationRows}
                    />

                    <PasswordInput required
                                   label={PasswordFormLocalizer.resetPasswordConfirmPasswordInput}
                                   model={this.passwordConfirmation}
                    />

                    <ButtonContainer>
                        <Button submit
                                type={ButtonType.Orange}
                                label={PasswordFormLocalizer.save}
                        />
                    </ButtonContainer>

                </Form>
            </React.Fragment>
        );
    }
}