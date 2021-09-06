import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Accordion, Button, Checkbox, Dropdown, DropdownOrderBy, DropdownRequiredType, FourColumns, SelectListItem, TogglerPosition, TwoColumns} from "@weare/athenaeum-react-components";

export interface IAccordionTestsState {
    autoCollapse: boolean;
    content: React.ReactNode[];
    toggler: boolean;
    togglerPosition: TogglerPosition;
}

export default class AccordionTests extends BaseComponent<{}, IAccordionTestsState> {

    public state: IAccordionTestsState = {
        autoCollapse: true,
        content: [AccordionTests.createContent()],
        toggler: false,
        togglerPosition: TogglerPosition.Header
    }

    private static createContent(): React.ReactNode {
        return (
            <div>
                Content
            </div>
        );
    }

    private static getAccordionTogglerPositionName(item: TogglerPosition | null): string {
        switch (item) {
            case TogglerPosition.Header: return "Header";
            case TogglerPosition.Bottom: return "Bottom";
            default: return "Default (undefined)";
        }
    }

    public render(): React.ReactNode {
        console.log(this.state);

        return (
            <div style={{margin: "1rem 0"}}>
                <div className="mb-3">

                    <FourColumns>

                        <Checkbox inline
                                  label="Toggler"
                                  value={this.state.toggler}
                                  onChange={async (sender, value) => {this.setState({toggler: value})}}
                        />

                        <Checkbox inline
                                  label="Auto-collapse"
                                  value={this.state.autoCollapse}
                                  onChange={async (sender, value) => {this.setState({autoCollapse: value})}}
                        />

                        <Button label="Add content"
                                onClick={async () => {this.state.content.push(AccordionTests.createContent())}}
                        />

                        <Button label="Remove content"
                                onClick={async () => {this.state.content.pop()}}
                        />

                    </FourColumns>

                    <Dropdown inline required noValidate noWrap noFilter
                              label="Toggler position"
                              items={[TogglerPosition.Header, TogglerPosition.Bottom]}
                              selectedItem={this.state.togglerPosition}
                              transform={(item) => new SelectListItem(item.toString(), AccordionTests.getAccordionTogglerPositionName(item), null, item)}
                              onChange={async (sender, value) => {this.setState({ togglerPosition: value! })}}
                    />
                </div>

                <Accordion header="Header"
                           toggler={this.state.toggler}
                           togglerPosition={this.state.togglerPosition}
                           autoCollapse={this.state.autoCollapse}
                >
                    {
                        this.state.content
                    }
                </Accordion>

            </div>
        );
    }
}