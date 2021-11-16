import React from "react";
import {BaseComponent, ch} from "@weare/athenaeum-react-common";
import {AddressDivider, Button, Checkbox, Icon, IconSize, InlineType, TextInput, TogglerPosition} from "@weare/athenaeum-react-components";
import {GeoLocation, Utility} from "@weare/athenaeum-toolkit";

export interface IAddressDividerTestsState {
    formattedAddress: string;
}

export default class AddressDividerTests extends BaseComponent {


public state: IAddressDividerTestsState = {
    formattedAddress: ""
}
    
    private doChange(divider: AddressDivider, geo: GeoLocation) {
        this.setState({formattedAddress: geo.formattedAddress});
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <AddressDivider id="formattedAddress"
                                onChange={async (geo, location)=> this.doChange(geo, location)}
                                location={new GeoLocation(2, 2)}
                />
                Formatted text: <TextInput value={this.state.formattedAddress}></TextInput>
            </React.Fragment>
        );
    }
}