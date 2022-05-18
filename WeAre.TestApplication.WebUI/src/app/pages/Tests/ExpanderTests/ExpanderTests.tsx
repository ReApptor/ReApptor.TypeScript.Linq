import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import {Button, Dropdown, DropdownOrderBy, Expander, ExpanderType, FourColumns, NumberInput, SelectListItem} from "@weare/reapptor-react-components";

export interface IExpanderTestsState {
    type: ExpanderType,
    transitionTime: number
}

export default class ExpanderTests extends BaseComponent<{}, IExpanderTestsState> {

    public state: IExpanderTestsState = {
        type: ExpanderType.Vertical,
        transitionTime: 0.2
    }

    private readonly _ref: React.RefObject<Expander> = React.createRef();

    private createContent(): React.ReactNode {
        return (
            <div key={ch.getId()}>
                Content Content Content Content Content Content<br/>
                Content<br/>
                Content Content Content Content<br/>
                Content<br/>
                Content<br/>
                Conten Content Content Content Contentt<br/>
                Content Content<br/>
            </div>
        );
    }

    private getExpanderTypeName(item: ExpanderType): string {
        switch (item) {
            case ExpanderType.Vertical: return "Vertical";
            case ExpanderType.Horizontal: return "Horizontal";
        }
    }

    public render(): React.ReactNode {
        return (
            <div style={{margin: "1rem 0"}}>
                <div className="mb-3">

                    <FourColumns>

                        <Dropdown label="Type" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getExpanderTypeName(item), null, item)}
                                  items={[ExpanderType.Vertical, ExpanderType.Horizontal]}
                                  selectedItem={this.state.type}
                                  onChange={async (sender, value) => await this.setState({ type: value! })}
                        />
                        
                        <NumberInput inline
                                     label={"Transition time"}
                                     value={this.state.transitionTime}
                                     format={"0.0"}
                                     min={0.1}
                                     max={10}
                                     onChange={async (sender, value) => await this.setState({ transitionTime: value! })}
                        />

                        {/*<Checkbox inline*/}
                        {/*          label="Recalculate height on 'Add content'"*/}
                        {/*          value={this.state.recalculateOnAddContent}*/}
                        {/*          onChange={async (sender, value) => {this.setState({recalculateOnAddContent: value})}}*/}
                        {/*/>*/}

                    </FourColumns>

                </div>

                <FourColumns>
                    
                    <Button label={"Toggle"}
                            onClick={() => this._ref.current!.toggleAsync()}
                    />
                    
                </FourColumns>

                <Expander ref={this._ref}
                          type={this.state.type}
                          transitionTime={this.state.transitionTime}
                >
                    {
                        this.createContent()
                    }
                </Expander>

            </div>
        );
    }
}