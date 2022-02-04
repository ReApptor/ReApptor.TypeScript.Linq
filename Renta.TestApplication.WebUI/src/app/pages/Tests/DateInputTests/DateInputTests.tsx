import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import { Form, Checkbox, DateInput, OneColumn } from "@weare/athenaeum-react-components";

export interface IDateInputTestsState {
    normalDateInputValue: Date;
    minDate: null | Date;
    maxDate: null | Date;
    minDateActive: boolean;
    maxDateActive: boolean;
    todayButton: boolean;
    inline: boolean;
    popup: boolean;
    showTime: boolean;
    showOnlyTime: boolean;
    small: boolean;
    showMonthDropdown: boolean;
    showMonthYearPicker: boolean;
    showYearDropdown: boolean;
    readonly: boolean;
    rentaStyle: boolean;
    expanded: boolean;
}

export default class DateInputTests extends BaseComponent {

    state: IDateInputTestsState = {
        normalDateInputValue: new Date(),
        minDate: null,
        maxDate: null,
        minDateActive: false,
        maxDateActive: false,
        showYearDropdown: false,
        todayButton: false,
        inline: false,
        popup: false,
        showTime: false,
        showOnlyTime: false,
        small: false,
        showMonthDropdown: false,
        showMonthYearPicker: false,
        readonly: false,
        rentaStyle: false,
        expanded: false
    };
    
    public render(): React.ReactNode {        
        return (
            <React.Fragment>

                <Form className="pt-4">

                    <Checkbox inline className="pt-1 pb-1" label="todayButton" value={this.state.todayButton} onChange={async (sender, todayButton) => {await this.setState({todayButton})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="inline" value={this.state.inline} onChange={async (sender, inline) => {await this.setState({inline})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="popup" value={this.state.popup} onChange={async (sender, popup) => {await this.setState({popup})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="showTime" value={this.state.showTime} onChange={async (sender, showTime) => {await this.setState({showTime})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="showOnlyTime" value={this.state.showOnlyTime} onChange={async (sender, showOnlyTime) => {await this.setState({showOnlyTime})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="small" value={this.state.small} onChange={async (sender, small) => {await this.setState({small})}} />

                    <Checkbox inline className="pt-1 pb-1" label="showYearDropdown" value={this.state.showYearDropdown} onChange={async (sender, showYearDropdown) => {await this.setState({showYearDropdown})}} />

                    <Checkbox inline className="pt-1 pb-1" label="showMonthDropdown" value={this.state.showMonthDropdown} onChange={async (sender, showMonthDropdown) => {await this.setState({showMonthDropdown})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="showMonthYearPicker" value={this.state.showMonthYearPicker} onChange={async (sender, showMonthYearPicker) => {await this.setState({showMonthYearPicker})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="readonly" value={this.state.readonly} onChange={async (sender, readonly) => {await this.setState({readonly})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="rentaStyle" value={this.state.rentaStyle} onChange={async (sender, rentaStyle) => {await this.setState({rentaStyle})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="expanded" value={this.state.expanded} onChange={async (sender, expanded) => {await this.setState({expanded})}} />
                             
                    <Checkbox inline className="pt-1 pb-1" label="minDate" value={this.state.minDateActive} onChange={async (sender, minDateActive) => {await this.setState({minDateActive})}} />
                    
                    <Checkbox inline className="pt-1 pb-1" label="maxDate" value={this.state.maxDateActive} onChange={async (sender, maxDateActive) => {await this.setState({maxDateActive})}} />
                    
                    {
                        this.state.minDateActive && <DateInput className="pt-1 pb-1" value={this.state.minDate || undefined} inline label="minDate" onChange={async (minDate)=>{ await this.setState({minDate})}}/>
                    }
                       
                    {
                        this.state.maxDateActive && <DateInput className="pt-1 pb-1" value={this.state.maxDate || undefined}  inline label="maxDate" onChange={async (maxDate)=>{ await this.setState({maxDate})}}/>
                    }
                    
                    <OneColumn>

                        <DateInput
                            label="Start"
                            todayButton={this.state.todayButton ? "Today" : ""}
                            inline={this.state.inline}
                            popup={this.state.popup}
                            showTime={this.state.showTime}
                            showOnlyTime={this.state.showOnlyTime}
                            small={this.state.small}
                            showMonthDropdown={this.state.showMonthDropdown}
                            showMonthYearPicker={this.state.showMonthYearPicker}
                            showYearDropdown={this.state.showYearDropdown}
                            readonly={this.state.readonly}
                            rentaStyle={this.state.rentaStyle}
                            expanded={this.state.expanded}
                            value={this.state.normalDateInputValue}
                            minDate={this.state.minDateActive ? this.state.minDate : null}
                            maxDate={this.state.maxDateActive ? this.state.maxDate : null}
                            onChange={async (normalDateInputValue)=>{ await this.setState({normalDateInputValue})}} />
                        
                    </OneColumn>
                    
                    <h4 className="pt-1 pb-1">{this.state.normalDateInputValue.toDateString()} - {this.state.normalDateInputValue.toTimeString()}</h4>
                    
                    <h4 className="pt-1 pb-1">{JSON.stringify(this.state.normalDateInputValue)}</h4>

                </Form>

            </React.Fragment>
        );
    }
}