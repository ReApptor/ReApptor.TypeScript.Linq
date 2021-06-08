import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { Form, DateRangeInput, OneColumn } from "@weare/athenaeum-react-components";

export interface IDateRangeInputTestsState {

}

export default class DateRangeInputTests extends BaseComponent {

    state: IDateRangeInputTestsState = {

    };
    
    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <Form className="pt-4">
                    
                    <OneColumn>

                        <DateRangeInput  clickToEdit/>
                        
                    </OneColumn>

                    
                    <OneColumn>

                        <DateRangeInput  />
                        
                    </OneColumn>

                </Form>

            </React.Fragment>
        );
    }
}