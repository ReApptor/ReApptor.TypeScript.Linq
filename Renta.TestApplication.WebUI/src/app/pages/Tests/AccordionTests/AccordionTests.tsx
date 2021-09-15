import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {Accordion, Button, Checkbox, Dropdown, DropdownOrderBy, DropdownRequiredType, FourColumns, NumberInput, SelectListItem, TogglerPosition, TwoColumns} from "@weare/athenaeum-react-components";

export interface IAccordionTestsState {
    autoCollapse: boolean;
    content: React.ReactNode[];
    maxHeightOffset: number;
    recalculateOnAddContent: boolean;
    toggler: boolean;
    togglerPosition: TogglerPosition;
}

export default class AccordionTests extends BaseComponent<{}, IAccordionTestsState> {

    public state: IAccordionTestsState = {
        autoCollapse: true,
        content: [AccordionTests.createContent()],
        maxHeightOffset: 0,
        recalculateOnAddContent: false,
        toggler: false,
        togglerPosition: TogglerPosition.Header
    }

    private readonly _accordionRef: React.RefObject<Accordion> = React.createRef();

    private static createContent(): React.ReactNode {
        return (
            <div key={ch.getId()}>
                Content
            </div>
        );
    }

    private static getAccordionTogglerPositionName(item: TogglerPosition | null): string {
        switch (item) {
            case TogglerPosition.Header:
                return "Header";
            case TogglerPosition.Bottom:
                return "Bottom";
            default:
                return "Default (undefined)";
        }
    }

    private addContent(): void {
        this.state.content.push(AccordionTests.createContent());
        this.reRender();

        if (this.state.recalculateOnAddContent) {
            this._accordionRef.current?.recalculateContentHeight();
        }
    }

    private removeContent(): void {
        this.state.content.pop();
        this.reRender();

        if (this.state.recalculateOnAddContent) {
            this._accordionRef.current?.recalculateContentHeight();
        }
    }

    public render(): React.ReactNode {
        return (
            <div style={{margin: "1rem 0"}}>
                <div className="mb-3">

                    <FourColumns>

                        <Button label="Add content"
                                onClick={async () => this.addContent()}
                        />

                        <Button label="Remove content"
                                onClick={async () => this.removeContent()}
                        />

                        <Button label="Recalculate height"
                                onClick={async () => await this._accordionRef.current?.recalculateContentHeight()}
                        />

                        <Checkbox inline
                                  label="Recalculate height on 'Add content'"
                                  value={this.state.recalculateOnAddContent}
                                  onChange={async (sender, value) => {this.setState({recalculateOnAddContent: value})}}
                        />

                    </FourColumns>

                    <FourColumns>

                        <Checkbox inline
                                  label="Auto-collapse"
                                  value={this.state.autoCollapse}
                                  onChange={async (sender, value) => {this.setState({autoCollapse: value})}}
                        />

                        <NumberInput inline
                                     label="Max-height offset"
                                     value={this.state.maxHeightOffset}
                                     onChange={async (_, value) => {this.setState({maxHeightOffset: value})}}
                        />

                        <Checkbox inline
                                  label="Toggler"
                                  value={this.state.toggler}
                                  onChange={async (sender, value) => {this.setState({toggler: value})}}
                        />

                        {
                            (this.state.toggler) &&
                            (
                                <Dropdown inline required noValidate noWrap noFilter
                                          label="Toggler position"
                                          items={[TogglerPosition.Header, TogglerPosition.Bottom]}
                                          selectedItem={this.state.togglerPosition}
                                          transform={(item) => new SelectListItem(item.toString(), AccordionTests.getAccordionTogglerPositionName(item), null, item)}
                                          onChange={async (sender, value) => {this.setState({ togglerPosition: value! })}}
                                />
                            )
                        }

                    </FourColumns>

                </div>

                <Accordion ref={this._accordionRef}
                           header="Header"
                           toggler={this.state.toggler}
                           togglerPosition={this.state.togglerPosition}
                           autoCollapse={this.state.autoCollapse}
                           maxHeightOffset={this.state.maxHeightOffset}
                >
                    {
                        this.state.content
                    }
                </Accordion>

            </div>
        );
    }
}