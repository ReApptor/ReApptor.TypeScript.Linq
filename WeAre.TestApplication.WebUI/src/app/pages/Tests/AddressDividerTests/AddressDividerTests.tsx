import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {AddressDivider, AddressDividerColumns, AddressHelper, Button, ButtonType, Checkbox, Dropdown, DropdownOrderBy, Form, Inline, OneColumn, SelectListItem, TextInput, TwoColumns} from "@weare/athenaeum-react-components";
import {GeoLocation} from "@weare/athenaeum-toolkit";
import {add} from "lodash";

export interface IAddressDividerTestsState {
    externalAddress: string;
    formattedAddress: string;
    columns: AddressDividerColumns | null;
    required: boolean;
    locationPicker: boolean;
    readonly: boolean;
}

export default class AddressDividerTests extends BaseComponent {

    public state: IAddressDividerTestsState = {
        externalAddress: "",
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
    
    private async testFormattedAddressAsync(): Promise<void> {
        const formattedAddress: string = this.state.formattedAddress;
        
        if (!formattedAddress) {
            await ch.alertErrorAsync("Formatted address is null or empty.", true, true);
            return;
        }
        
        const location: GeoLocation | null = AddressHelper.toLocation(formattedAddress);
        if (!location) {
            await ch.alertErrorAsync("Formatted address cannot be converted to location.", true, true);
            return;
        }
        
        if ((!location.lat) || (!location.lon)) {
            await ch.alertErrorAsync("Lat or Lon cannot be extracted from formatted address \"{0}\".".format(formattedAddress), true, true);
            return;
        }
        
        if (!location.country) {
            await ch.alertErrorAsync("Country cannot be extracted from formatted address \"{0}\".".format(formattedAddress), true, true);
            return;
        }
        
        if (!location.address) {
            await ch.alertErrorAsync("Address cannot be extracted from formatted address \"{0}\".".format(formattedAddress), true, true);
            return;
        }
        
        if (!location.postalCode) {
            await ch.alertWarningAsync("PostalCode cannot be extracted from formatted address \"{0}\".".format(formattedAddress), true, true);
            return;
        }
        
        if (!location.city) {
            await ch.alertWarningAsync("City cannot be extracted from formatted address \"{0}\".".format(formattedAddress), true, true);
            return;
        }

        await ch.alertMessageAsync("Formatted address \"{0}\" is valid and has all specified values.".format(formattedAddress), true, true);
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

    private async setExternalAddressAsync(value: string): Promise<void> {
        await this.setState({externalAddress: value});
    }
    
    private async recognizeExternalAddressAsync(): Promise<void> {
        await this.setState({formattedAddress: this.state.externalAddress});
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

                    <hr/>

                    <Button icon={{name: "fas check"}}
                            label={"Validate FORM"}
                            type={ButtonType.Primary}
                            onClick={() => this.validateAsync()}
                    />

                    <Button icon={{name: "fas check"}}
                            label={"Validate address format"}
                            type={ButtonType.Primary}
                            onClick={() => this.testFormattedAddressAsync()}
                    />

                    <hr/>

                    <OneColumn>
                        <TextInput id={""}
                                   label={"External String or Formatted address to recognize:"}
                                   value={this.state.externalAddress}
                                   onChange={(sender, value) => this.setExternalAddressAsync(value)}
                        />
                    </OneColumn>

                    <OneColumn>
                        <Button label={"Recognize"}
                                onClick={() => this.recognizeExternalAddressAsync()}
                        />
                    </OneColumn>

                </Form>

                <hr/>

                <span><b>Formatted text:</b> {this.state.formattedAddress}</span>

            </React.Fragment>
        );
    }
}