import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { Form, DateRangeInput, OneColumn, Checkbox, DateInput } from "@weare/athenaeum-react-components";

export interface IDateRangeInputTestsState {
    sameDay: boolean
    start: Date
    end: Date
}

export default class DateRangeInputTests extends BaseComponent {

    state: IDateRangeInputTestsState = {
        sameDay: false,
        start: new Date(),
        end: new Date(new Date().setMonth(new Date().getMonth() + 1))
    };
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Form className="pt-4">
                    <Checkbox inline label="sameDay" value={this.state.sameDay} onChange={async (sender, sameDay) => await this.setState({sameDay})}/>

                    <div>start: {this.state.start.toDateString()}</div>
                    <div>end: {this.state.end.toDateString()}</div>
                    
                    <OneColumn className="pt-4">
        
                        <DateRangeInput
                            sameDay={this.state.sameDay} 
                            startValue={this.state.start}
                            endValue={this.state.end}
                            onValueChange={async (start: Date, end: Date)=>{await this.setState({start, end})}}
                        />

                    </OneColumn>

                </Form>

            </React.Fragment>
        );
    }
}