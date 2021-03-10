import React from "react";
import {GeoLocation} from "@weare/athenaeum-toolkit";
import {BaseComponent} from "@weare/athenaeum-react-common";
import LayoutTwoColumns from "../LayoutTwoColumns/LayoutTwoColumns";
import AddressInput from "../AddressInput/AddressInput";
import TextInput from "../TextInput/TextInput";
import { IInput } from "@/components/BaseInput/BaseInput";
import Comparator from "../../helpers/Comparator";
import AddressDividerLocalizer from "./AddressDividerLocalizer";

interface IAddressDividerProps {
    id?: string;
    required?: boolean;
    readonly?: boolean;
    location?: GeoLocation;
    locationPicker?: boolean;
    onChange?(sender: AddressDivider, location: GeoLocation): Promise<void>;
}

interface IAddressDividerState {
    location: GeoLocation,
    readonly: boolean
}

export default class AddressDivider extends BaseComponent<IAddressDividerProps, IAddressDividerState> implements IInput {
    
    state: IAddressDividerState = {
        location: this.props.location || new GeoLocation(),
        readonly: this.props.readonly || false
    };

    private readonly _containerRef: React.RefObject<LayoutTwoColumns> = React.createRef();
    private readonly _addressInputRef: React.RefObject<AddressInput> = React.createRef();

    private get location(): GeoLocation {
        return this.state.location;
    }
    
    private get addressInput(): AddressInput {
        const container: LayoutTwoColumns = this._containerRef.current!;
        return container.findComponent(`${this.id}_formattedAddress`) as AddressInput;
    }

    private async onPlaceSelectedAsync(location: GeoLocation): Promise<void> {
        await this.setState({ location });

        if(this.props.onChange) {
            await this.props.onChange(this, location);
        }
    }

    public isInput(): boolean { return true };

    public isValid(): boolean {
        return (!this.addressInput.state.validationError);
    }

    public getName(): string {
        return this.id;
    }
    
    public getValue(): any {
        return this.addressInput.getValue();
    }

    public get readonly(): boolean {
        return this.state.readonly;
    }

    public async setReadonlyAsync(value: boolean): Promise<void> {
        if (value != this.state.readonly) {
            await this.setState({ readonly: value });
            await this._addressInputRef.current!.setReadonlyAsync(value);
        }
    }
    
    public async validateAsync(): Promise<void> {
        await this.addressInput.validateAsync();
    }

    public async hideEditAsync(): Promise<void> {
        await this.addressInput.hideEditAsync();
    }

    public async showEditAsync(select?: boolean): Promise<void> {
        await this.addressInput.showEditAsync(select);
    }
    
    public async componentWillReceiveProps(nextProps: IAddressDividerProps): Promise<void> {
        
        const newLocation: boolean = (!Comparator.isEqual(this.props.location, nextProps.location));
        
        if (newLocation) {
            const location: GeoLocation = nextProps.location || new GeoLocation();
            await this.setState({ location });
        }
    }

    render() {
        return (
            <React.Fragment>
                <LayoutTwoColumns ref={this._containerRef}>
                    <AddressInput id={`${this.id}_formattedAddress`}
                                  ref={this._addressInputRef}
                                  label={AddressDividerLocalizer.address}
                                  required={this.props.required}
                                  readonly={this.readonly}
                                  value={this.location.formattedAddress}
                                  locationPicker={this.props.locationPicker}
                                  append={this.props.locationPicker}
                                  onChange={async (location) => await this.onPlaceSelectedAsync(location)}
                    />
                    <TextInput id={`${this.id}_address`} label={AddressDividerLocalizer.get("Form.Input.Street")} value={this.location.address} readonly />
                </LayoutTwoColumns>
                
                <LayoutTwoColumns>
                    <TextInput id={`${this.id}_city`} label={AddressDividerLocalizer.get("Form.Input.City")} value={this.location.city} readonly />
                    <TextInput id={`${this.id}_postalCode`} label={AddressDividerLocalizer.get("Form.Input.Postalcode")} value={this.location.postalCode} readonly />
                </LayoutTwoColumns>
            </React.Fragment>
        )
    }
}