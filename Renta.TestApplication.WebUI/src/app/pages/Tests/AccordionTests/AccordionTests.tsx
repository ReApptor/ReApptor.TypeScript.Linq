import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Accordion, Checkbox, Dropdown, DropdownOrderBy, SelectListItem, TogglerPosition} from "@weare/athenaeum-react-components";

export interface IAccordionTestsState {
    toggler: boolean,
    togglerPosition: TogglerPosition
}
export default class AccordionTests extends BaseComponent {
    state: IAccordionTestsState = {
        toggler: false,
        togglerPosition: TogglerPosition.Header
    }

    private getAccordionTogglerPositionName(item: TogglerPosition | null): string {
        switch (item) {
            case TogglerPosition.Header: return "Header";
            case TogglerPosition.Bottom: return "Bottom";
            default: return "Default (undefined)";
        }
    }
    

        public render(): React.ReactNode {
            console.log(this.state)
        return (
            <div style={{margin: "1rem 0"}}>
                <div className="mb-3">
                    <Checkbox label="Toggler" inline
                              value={this.state.toggler}
                              onChange={async (sender, value) => await this.setState({toggler: value})}
                    />
                    
                    <Dropdown label="Toggler position" inline required noValidate noWrap noFilter
                              orderBy={DropdownOrderBy.None}
                              transform={(item) => new SelectListItem(item.toString(), this.getAccordionTogglerPositionName(item), null, item)}
                              items={[TogglerPosition.Header, TogglerPosition.Bottom]}
                              selectedItem={this.state.togglerPosition ?? -1}
                              onChange={async (sender, value) => await this.setState({ togglerPosition: value })}
                    />
                </div>
                
                <Accordion header="Header" toggler={this.state.toggler} togglerPosition={this.state.togglerPosition} >
                    <div>
                        Content
                    </div>
                </Accordion>
            </div>
        );
    }
}