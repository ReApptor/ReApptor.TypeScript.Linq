import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { Form, DateRangeInput, OneColumn, Checkbox, DateInput } from "@weare/athenaeum-react-components";

export interface IDateRangeInputTestsState {
    expanded: boolean;
    sameDay: boolean;
    clickToEdit: boolean;
    start: Date;
    end: Date;
    minDateActive: boolean;
    minDate: Date | null;
    maxDateActive: boolean;
    maxDate: Date | null;
}

export default class DateRangeInputTests extends BaseComponent {

    state: IDateRangeInputTestsState = {
        expanded: false,
        clickToEdit: false,
        sameDay: false,
        start: new Date(),
        end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        minDateActive: false,
        minDate: null,
        maxDateActive: false,
        maxDate: null
    };
    
    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Form className="pt-4">
                    <Checkbox inline label="expanded" value={this.state.expanded} onChange={async (sender, expanded) => await this.setState({expanded})}/>
                    <Checkbox inline label="sameDay" value={this.state.sameDay} onChange={async (sender, sameDay) => await this.setState({sameDay})}/>
                    <Checkbox inline label="clickToEdit" value={this.state.clickToEdit} onChange={async (sender, clickToEdit) => await this.setState({clickToEdit})}/>
                    <Checkbox inline label="minDate" value={this.state.minDateActive} onChange={async (sender, minDateActive) => await this.setState({minDateActive, minDate: minDateActive ? this.state.minDate : null})}/>
                    <Checkbox inline label="maxDate" value={this.state.maxDateActive} onChange={async (sender, maxDateActive) => await this.setState({maxDateActive, maxDate: maxDateActive ? this.state.maxDate : null})}/>
                    {(this.state.minDateActive) && (<DateInput label="minDate" value={this.state.minDate || undefined} onChange={async (minDate) => await this.setState({minDate})}/>)}
                    {(this.state.maxDateActive) && (<DateInput label="maxDate" value={this.state.maxDate || undefined} onChange={async (maxDate) => await this.setState({maxDate})}/>)}
                    <div>start: {this.state.start.toDateString()}</div>
                    <div>end: {this.state.end.toDateString()}</div>
                    
                    <OneColumn className="pt-4">
                        
                        <DateRangeInput
                            minDate={this.state.minDate || undefined}
                            maxDate={this.state.maxDate || undefined}
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