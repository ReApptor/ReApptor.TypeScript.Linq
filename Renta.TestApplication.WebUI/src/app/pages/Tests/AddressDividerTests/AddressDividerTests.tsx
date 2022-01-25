import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {AddressDivider, AddressDividerColumns, Button, ButtonType, Checkbox, Dropdown, DropdownOrderBy, Form, SelectListItem} from "@weare/athenaeum-react-components";
import {GeoLocation} from "@weare/athenaeum-toolkit";

export interface IAddressDividerTestsState {
    formattedAddress: string;
    columns: AddressDividerColumns | null;
    required: boolean;
    locationPicker: boolean;
    readonly: boolean;
}

export default class AddressDividerTests extends BaseComponent {

    public state: IAddressDividerTestsState = {
        formattedAddress: "",
        columns: null,
        required: true,
        locationPicker: false,
        readonly: false,
    }

    private readonly _formRef: React.RefObject<Form> = React.createRef();

    private async validateAsync(): Promise<void> {
        if (this._formRef.current) {
            const valid: boolean = await this._formRef.current.validateAsync();
            if (valid) {
                await ch.alertMessageAsync("Form is valid.", true, true);
            } else {
                await ch.alertErrorAsync("Form is not valid.", true, true);
            }
        }
    }

    private getAddressDividerColumnName(item: AddressDividerColumns | null): string {
        switch (item) {
            case AddressDividerColumns.One: return "One";
            case AddressDividerColumns.Two: return "Two";
            default: return "Default (undefined)";
        }
    }

    private async onChangeAsync(sender: AddressDivider, location: GeoLocation): Promise<void> {
        await this.setState({formattedAddress: location.formattedAddress});
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                <Form>

                    <Dropdown label="Columns" inline required noValidate noWrap noFilter
                              orderBy={DropdownOrderBy.None}
                              transform={(item) => new SelectListItem(item.toString(), this.getAddressDividerColumnName(item), null, item)}
                              items={[-1, 1, 2]}
                              selectedItem={this.state.columns || -1}
                              onChange={async (sender, value) => this.setState({ columns: (value != -1) ? value : null })}
                    />

                    <Checkbox label="Required" inline
                              value={this.state.required}
                              onChange={async (sender, value) => this.setState({required: value})}
                    />

                    <Checkbox label="Location Picker" inline
                              value={this.state.locationPicker}
                              onChange={async (sender, value) => this.setState({locationPicker: value})}
                    />

                    <Checkbox label="Readonly" inline
                              value={this.state.readonly}
                              onChange={async (sender, value) => this.setState({readonly: value})}
                    />

                </Form>

                <hr/>

                <Form ref={this._formRef}>

                    <AddressDivider id="addressDivider"
                                    required={this.state.required}
                                    locationPicker={this.state.locationPicker}
                                    readonly={this.state.readonly}
                                    columns={this.state.columns || undefined}
                                    location={this.state.formattedAddress}
                                    onChange={async (sender, location) => this.onChangeAsync(sender, location)}
                    />

                    <Button icon={{name: "fas check"}}
                            label={"Validate"}
                            type={ButtonType.Primary}
                            onClick={() => this.validateAsync()}
                    />

                </Form>

                <hr/>

                <span><b>Formatted text:</b> {this.state.formattedAddress}</span>

            </React.Fragment>
        );
    }
}