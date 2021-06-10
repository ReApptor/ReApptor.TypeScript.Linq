import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { Form, DateRangeInput, OneColumn, Checkbox, DateInput } from "@weare/athenaeum-react-components";

export interface IDateRangeInputTestsState {
    expanded: boolean;
    sameDay: boolean;
    clickToEdit: boolean;
    start: Date;
    end: Date;
}

export default class DateRangeInputTests extends BaseComponent {

    state: IDateRangeInputTestsState = {
        expanded: false,
        clickToEdit: false,
        sameDay: false,
        start: new Date(),
        end: new Date(new Date().setMonth(new Date().getMonth() + 1))
    };
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Form className="pt-4">
                    <Checkbox inline label="expanded" value={this.state.expanded} onChange={async (sender, expanded) => await this.setState({expanded})}/>
                    <Checkbox inline label="sameDay" value={this.state.sameDay} onChange={async (sender, sameDay) => await this.setState({sameDay})}/>
                    <Checkbox inline label="clickToEdit" value={this.state.clickToEdit} onChange={async (sender, clickToEdit) => await this.setState({clickToEdit})}/>

                    <div>start: {this.state.start.toDateString()}</div>
                    <div>end: {this.state.end.toDateString()}</div>
                    
                    <OneColumn className="pt-4">
                        
                        <DateRangeInput
                            sameDay={this.state.sameDay}
                            expanded={this.state.expanded}
                            clickToEdit={this.state.clickToEdit} 
                            value={[this.state.start, this.state.end]}
                            onChange={async ([start, end]: [Date, Date])=>{await this.setState({start, end})}}
                        />

                    </OneColumn>

                </Form>

            </React.Fragment>
        );
    }
}