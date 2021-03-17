import React from "react";
import {BaseComponent, ch, DocumentPreviewSize} from "@weare/athenaeum-react-common";
import { Button, ButtonContainer, ButtonType, Checkbox, DateInput, Form, LayoutThreeColumns, LayoutTwoColumns, TextAreaInput, TextInput, FourColumns } from "@weare/athenaeum-react-components";


interface IModalTestsState {
    documentPreviewSize: DocumentPreviewSize;
}

export default class FormTests extends BaseComponent<{}, IModalTestsState> {

    state: IModalTestsState = {
        documentPreviewSize: DocumentPreviewSize.Medium
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form onSubmit={() => ch.alertMessageAsync("Submit", true) }>

                    <LayoutTwoColumns>

                        <Checkbox label={"Checkbox #1"} inline />

                        <Checkbox label={"Checkbox #1"} readonly />

                    </LayoutTwoColumns>

                    <LayoutThreeColumns>

                        <TextInput label={"Text input #1"}  />

                        <TextInput label={"Text input #2"} required />

                        <TextInput label={"Text input #3"} readonly />

                    </LayoutThreeColumns>

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

                    <ButtonContainer>

                        <Button label={"Cancel"} />

                        <Button label={"Dummy"} type={ButtonType.Info} />

                        <Button submit label={"Save"} type={ButtonType.Orange} />

                    </ButtonContainer>

                </Form>

            </React.Fragment>
        );
    }
}