import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {Checkbox, Dropdown, DropdownOrderBy, DropdownSubtextType, Form, List, SelectListItem, TwoColumns} from "@weare/reapptor-react-components";

export interface IListTestsState {
    multiSelect: boolean,
    search: boolean,
    required: boolean,
    subtextType: DropdownSubtextType,
    disabled: boolean
}

export default class ListTests extends BaseComponent<{}, IListTestsState> {

    state: IListTestsState = {
        multiSelect: false,
        search: false,
        required: false,
        subtextType: DropdownSubtextType.Row,
        disabled: false
    };

    private readonly _listRef: React.RefObject<List> = React.createRef();

    private items: any[] = [
        {name: "1st item", group: "1", subtext: "subText 1"},
        {name: "2nd item", group: "1", subtext: "subText 2"},
        {name: "3d item", group: "2", subtext: "subText 3"},
        {name: "4th item", group: "2", subtext: "subText 4"},
        {name: "5th item", group: "3", subtext: "subText 5"}
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

    private async fetchListItemsAsync(): Promise<any[]> {
        if (this.state.search) {
            return this.itemsList;
        } else {
            return this.items;
        }
    }

    private async setSearchAsync(search: boolean): Promise<void> {
        await this.setState({search});
        if (this._listRef.current) {
            await this._listRef.current.reloadAsync();
        }
    }

    private getDropdownSubtextTypeName(item: DropdownSubtextType): string {
        switch (item) {
            case DropdownSubtextType.Row: return "Row";
            case DropdownSubtextType.Inline: return "Inline";
            case DropdownSubtextType.Hidden: return "Hidden";
        }
    }

    public render(): React.ReactNode {

        return (
            <React.Fragment>

                <TwoColumns>

                    <Form>

                        <Checkbox label="MultiSelect"
                                  inline
                                  value={this.state.multiSelect}
                                  onChange={async (sender, value) => await this.setState({multiSelect: value})}
                        />

                        <Checkbox label="Search (Uses list of 10 items)"
                                  inline
                                  value={this.state.search}
                                  onChange={async (sender, value) => await this.setSearchAsync(value)}
                        />

                        <Checkbox label="Required"
                                  inline
                                  value={this.state.required}
                                  onChange={async (sender, value) => await this.setState({required: value})}
                        />

                        <Checkbox label="Disabled"
                                  inline
                                  value={this.state.disabled}
                                  onChange={async (sender, value) => await this.setState({disabled: value})}
                        />

                        <Dropdown label="Subtext Type" inline required noValidate noWrap noFilter
                                  orderBy={DropdownOrderBy.None}
                                  transform={(item) => new SelectListItem(item.toString(), this.getDropdownSubtextTypeName(item), null, item)}
                                  items={[DropdownSubtextType.Row, DropdownSubtextType.Inline, DropdownSubtextType.Hidden]}
                                  selectedItem={this.state.subtextType}
                                  onChange={async (sender, value) => await this.setState({ subtextType: value! })}
                        />

                    </Form>

                    <List label="List" ref={this._listRef}
                          fetchItems={async () => await this.fetchListItemsAsync()}
                          multiple={this.state.multiSelect}
                          required={this.state.required}
                          disabled={this.state.disabled}
                          subtextType={this.state.subtextType}
                    />

                </TwoColumns>

            </React.Fragment>
        );
    }
}