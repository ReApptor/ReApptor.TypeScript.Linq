import React from "react";
import {BaseComponent, ch, DocumentPreviewSize, PasswordValidationRule} from "@weare/athenaeum-react-common";
import {Button, ButtonContainer, ButtonType, Checkbox, DateInput, Form, ThreeColumns, TwoColumns, TextAreaInput, TextInput, FourColumns, UrlInput, ValidationRow} from "@weare/athenaeum-react-components";
import PasswordFormLocalizer from "../../../../../../WeAre.Athenaeum.React.Components/src/components/PasswordForm/PasswordFormLocalizer";

interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
}

export default class FormTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium
    };

    private readonly model1={value: "1"};
    private readonly model2={value: "2"};
    private readonly model3={value: "3"};
    private readonly model4={value: "4"};

    private get validationRows() {
       return [
            new ValidationRow(PasswordValidationRule.UpperCaseCharacter, PasswordFormLocalizer.helpTextUpperCase),
            new ValidationRow(PasswordValidationRule.LowerCaseCharacter, PasswordFormLocalizer.helpTextLowerCase),
            new ValidationRow(PasswordValidationRule.NumberCharacter, PasswordFormLocalizer.helpTextNumber),
            new ValidationRow(PasswordValidationRule.SpecialCharacter, PasswordFormLocalizer.helpTextSpecialCharacter)
        ]
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form onSubmit={() => ch.alertMessageAsync("Submit", true) }>

                    <TwoColumns>

                        <Checkbox label={"Checkbox #1"} inline />

                        <Checkbox label={"Checkbox #1"} readonly />

                    </TwoColumns>

                    <ThreeColumns>

                        <TextInput label={"Text input #1 (NoAutoComplete)"} autoComplete={false} />

                        <TextInput label={"Text input #2"} required />

                        <TextInput label={"Text input #3"} readonly />

                    </ThreeColumns>

                    <FourColumns>

                        <TextAreaInput label={"Text area #1 (50)"} placeholder={"Enter value"} maxLength={50} />

                        <TextAreaInput label={"Text area #2 (Default)"} placeholder={"Enter value"} />

                        <TextAreaInput label={"Text area #3 (Readonly)"} placeholder={"Enter value"} value="Readonly Text Area" readonly />

                        <TextAreaInput label={"Text area #4 (Click to edit)"} placeholder={"Enter value"} value="Readonly Text Area" clickToEdit />

                    </FourColumns>

                    <FourColumns>

                        <DateInput label={"Date input #1"}  />

                        <DateInput label={"Date input #2"} required />

                        <DateInput label={"Date input #3"} readonly />

                        <DateInput label={"Date input #4"} shortDate append={"?"} />
                        
                    </FourColumns>

                    <TwoColumns>

                        <DateInput label={"Date input #5"} showTime />
                        
                        <DateInput label={"Date input #6"} showTime showOnlyTime />
                        
                    </TwoColumns>

                    <TwoColumns>

                        <UrlInput label={"Url input #1"} />

                        <UrlInput required label={"Url input #2"} value={"http://localhost:58080/"} />
                        
                    </TwoColumns>

                    <ButtonContainer>

                        <Button label={"Cancel"} />

                        <Button label={"Dummy"} type={ButtonType.Info} />

                        <Button submit label={"Save"} type={ButtonType.Orange} />

                    </ButtonContainer>

                    <FourColumns>

                        <TextInput label={"-"} model={this.model1} />

                        <TextInput label={"validators "} liveValidator={this.validationRows} model={this.model2}  />

                        <TextInput label={"required"} required model={this.model3} />
                        
                        <TextInput label={"required validators"} required liveValidator={this.validationRows} model={this.model4} />

                    </FourColumns>

                </Form>

            </React.Fragment>
        );
        
    }

}