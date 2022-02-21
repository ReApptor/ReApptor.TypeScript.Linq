import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {Form, DateRangeInput, OneColumn, Checkbox, DateInput, DateRangeInputValue, Button} from "@weare/reapptor-react-components";

export interface IDateRangeInputTestsState {
    expanded: boolean;
    sameDay: boolean;
    clickToEdit: boolean;
    dateRange: DateRangeInputValue;
    minDateActive: boolean;
    minDate: Date | null;
    maxDateActive: boolean;
    maxDate: Date | null;
}

export default class DateRangeInputTests extends BaseComponent<{}, IDateRangeInputTestsState> {

    state: IDateRangeInputTestsState = {
        expanded: false,
        clickToEdit: false,
        sameDay: false,
        dateRange: [DateRangeInput.getStartOfDay(new Date()), DateRangeInput.getStartOfDay(new Date())],
        minDateActive: false,
        minDate: null,
        maxDateActive: false,
        maxDate: null
    };

    private async resetByModel(): Promise<void> {
        await this.setState({dateRange: [null, null]});
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Form className="pt-4">
                    <Button label="Reset via model" onClick={async (_: Button, expanded: string) => await this.resetByModel()}/>
                    <Checkbox inline label="expanded" value={this.state.expanded} onChange={async (sender, expanded) => this.setState({expanded})}/>
                    <Checkbox inline label="sameDay" value={this.state.sameDay} onChange={async (sender, sameDay) => this.setState({sameDay})}/>
                    <Checkbox inline label="clickToEdit" value={this.state.clickToEdit} onChange={async (sender, clickToEdit) => this.setState({clickToEdit})}/>
                    <Checkbox inline label="minDate" value={this.state.minDateActive} onChange={async (sender, minDateActive) => this.setState({minDateActive, minDate: minDateActive ? this.state.minDate : null})}/>
                    <Checkbox inline label="maxDate" value={this.state.maxDateActive} onChange={async (sender, maxDateActive) => this.setState({maxDateActive, maxDate: maxDateActive ? this.state.maxDate : null})}/>

                    {(this.state.minDateActive) && (<DateInput label="minDate" value={this.state.minDate || undefined} onChange={async (minDate) => this.setState({minDate})}/>)}

                    {(this.state.maxDateActive) && (<DateInput label="maxDate" value={this.state.maxDate || undefined} onChange={async (maxDate) => this.setState({maxDate})}/>)}

                    <div>Start: {this.state.dateRange[0]?.toDateString()}</div>

                    <div>End: {this.state.dateRange[1]?.toDateString()}</div>

                    <OneColumn className="pt-4">

                        <DateRangeInput minDate={this.state.minDate || undefined}
                                        maxDate={this.state.maxDate || undefined}
                                        sameDay={this.state.sameDay}
                                        expanded={this.state.expanded}
                                        model={{value: this.state.dateRange}}
                                        clickToEdit={this.state.clickToEdit}
                                        onChange={async (value: DateRangeInputValue | undefined) => {
                                            if (!value) {
                                                this.setState({dateRange: [null, null]});
                                                return;
                                            }
                                            this.setState({dateRange: value});
                                        }}
                        />

                    </OneColumn>

                </Form>

            </React.Fragment>
        );
    }
}