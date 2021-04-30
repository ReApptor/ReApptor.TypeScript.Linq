import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {ButtonType, Checkbox, Form, FourColumns, InlineType} from "@weare/athenaeum-react-components";

interface IButtonTestsState {
}

export default class CheckboxTests extends BaseComponent<{}, IButtonTestsState> {

    state: IButtonTestsState = {
    };

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <Form className="pt-3" onSubmit={() => ch.alertMessageAsync("Submit", true) }>

                    <FourColumns>

                        <Checkbox label={"Default (false)"}  inlineType={InlineType.Left}  />
                        
                        <Checkbox label={"Default (false) (readonly)"}  inlineType={InlineType.Left} readonly  />
                        
                    </FourColumns>
                    
                    <FourColumns>

                        <Checkbox value label={"Default (true)"}  inlineType={InlineType.Left}  />
                        
                        <Checkbox value label={"Default (true) (readonly)"}  inlineType={InlineType.Left} readonly  />
                        
                    </FourColumns>
                        
                </Form>

            </React.Fragment>
        );
    }
}