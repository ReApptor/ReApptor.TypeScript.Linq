import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {Form, PhoneInput} from "@weare/reapptor-react-components";

interface IPhoneInputTestsState {
}

export default class PhoneInputTests extends BaseComponent<{}, IPhoneInputTestsState> {

    public render(): React.ReactNode {

        return (
            <React.Fragment>
                
                <Form>
                    
                    <PhoneInput id="phone"
                                className={"w-25"}
                                label={"Enter phone number"}
                    />
                    
                </Form>
                
            </React.Fragment>
        );
    }
}