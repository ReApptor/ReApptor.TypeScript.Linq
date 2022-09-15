import React from "react";
import {BaseComponent, ch} from "@weare/reapptor-react-common";
import { AmountListItem, Checkbox, DropdownWidget, Form, TwoColumns, List, WidgetContainer } from "@weare/reapptor-react-components";


export interface IDropdownWidgetTestsState {
    multiSelect: boolean,
    search: boolean,
    favorite: boolean,
    required: boolean,
    expanded: boolean,
    amountListItem: boolean,
    noDescription: boolean,
    icon: boolean,
    minimized: boolean,
    autoCollapse: boolean,
}

export default class DropdownWidgetTests extends BaseComponent<{}, IDropdownWidgetTestsState> {

    state: IDropdownWidgetTestsState = {
        multiSelect: false,
        search: false,
        favorite: false,
        required: false,
        expanded: false,
        amountListItem: false,
        noDescription: false,
        icon: false,
        minimized: false,
        autoCollapse: false,
    };

    private readonly _listRef: React.RefObject<List> = React.createRef();

    private items: any[] = [
        {name: "1st item", group: "1"},
        {name: "2nd item", group: "1"},
        {name: "3d item", group: "2"},
        {name: "4th item", group: "2"},
        {name: "5th item", group: "3"}
    ];

    private amountItems: any[] = [
        {name: "1st item", amount: 0, step: 1},
        {name: "2nd item", amount: 0, step: 1},
        {name: "3d item", amount: 0, step: 1},
        {name: "4th item", amount: 0, step: 1},
        {name: "5th item", amount: 0, step: 1},
    ];

    private itemsList: any[] = [
        {name: "0th item", group: "0"},
        {name: "1st item", group: "1"},
        {name: "2nd item", group: "2"},
        {name: "3d item", group: "3"},
        {name: "4th item", group: "4"},
        {name: "5th item", group: "5"},
        {name: "6th item", group: "6"},
        {name: "7th item", group: "7"},
        {name: "8th item", group: "8"},
        {name: "9th item", group: "9"}
    ];

    private dropdownItems(): any[] {
        if (this.state.amountListItem) {
            return this.amountListItems;
        }
        else if (this.state.search) {
            return this.itemsList;
        }

        return this.items;
    }

    private async setSearchAsync(search: boolean): Promise<void> {
        await this.setState({search});
        if (this._listRef.current) {
            await this._listRef.current.reloadAsync();
        }
    }

    private get amountListItems(): AmountListItem[] {
        return this.amountItems.map((item, index) => {
            const amountListItem: AmountListItem = new AmountListItem();
            amountListItem.step = item.step;
            amountListItem.amount = item.amount;
            amountListItem.value = index.toString();
            amountListItem.text = item.name;
            amountListItem.subtext = "";
            return amountListItem;
        });
    }

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <TwoColumns>

                    <Form>

                        <Checkbox label="MultiSelect"
                                  inline
                                  value={this.state.multiSelect}
                                  onChange={async (sender, value) => await this.setState({multiSelect:value})}/>

                        <Checkbox label="Search (Uses list of 10 items)"
                                  inline
                                  value={this.state.search}
                                  onChange={async (sender, value) => await this.setSearchAsync(value)}/>

                        <Checkbox label="Favorite"
                                  inline
                                  value={this.state.favorite}
                                  onChange={async (sender, value) => await this.setState({favorite:value})}/>

                        <Checkbox label="Required"
                                  inline
                                  value={this.state.required}
                                  onChange={async (sender, value) => await this.setState({required:value})}/>

                        <Checkbox label="Expanded"
                                  inline
                                  value={this.state.expanded}
                                  onChange={async (sender, value) => await this.setState({expanded:value})}/>

                        <Checkbox label="AmountListItem"
                                  inline
                                  value={this.state.amountListItem}
                                  onChange={async (sender, value) => await this.setState({amountListItem:value})}
                        />

                        <Checkbox label="noDescription"
                                  inline
                                  value={this.state.noDescription}
                                  onChange={async (sender, value) => await this.setState({noDescription:value})}
                        />

                        <Checkbox label="Icon"
                                  inline
                                  value={this.state.icon}
                                  onChange={async (sender, value) => await this.setState({icon: value})}
                        />

                        <Checkbox label="Minimized"
                                  inline
                                  value={this.state.minimized}
                                  onChange={async (sender, value) => await this.setState({minimized: value})}
                        />

                        <Checkbox label="AutoCollapse"
                                  inline
                                  value={this.state.autoCollapse}
                                  onChange={async (sender, value) => await this.setState({autoCollapse: value})}
                        />

                    </Form>
                    <div>
                        <WidgetContainer>

                            <DropdownWidget id="amountListItems" wide
                                            label="DropdownWidget"
                                            items={this.dropdownItems()}
                                            noDescription={this.state.noDescription}
                                            multiple={this.state.multiSelect}
                                            favorite={this.state.favorite}
                                            required={this.state.required}
                                            expanded={this.state.expanded}
                                            minimized={this.state.minimized}
                                            autoCollapse={this.state.autoCollapse}
                                            icon={this.state.icon ? {name: "far fa-atom-alt"} : undefined}
                                            onChange={async (sender, item: AmountListItem) => await ch.flyoutMessageAsync(sender.id + ".onChange:" + item + " " + item.amount)}
                            />

                        </WidgetContainer>

                    </div>
                </TwoColumns>

            </React.Fragment>
        );
    }
}