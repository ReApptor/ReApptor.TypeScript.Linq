import React from "react";
import {GeoLocation} from "@weare/reapptor-toolkit";
import {BaseComponent} from "@weare/reapptor-react-common";
import OneColumn from "../Layout.OneColumn/OneColumn";
import TwoColumns from "../Layout.TwoColumns/TwoColumns";
import AddressInput from "../AddressInput/AddressInput";
import TextInput from "../TextInput/TextInput";
import Comparator from "../../helpers/Comparator";
import { IInput } from "../BaseInput/BaseInput";
import AddressHelper from "../../helpers/AddressHelper";
import AddressDividerLocalizer from "./AddressDividerLocalizer";

export enum AddressDividerColumns {
    Two = 0,
    
    One = 1
}

interface IAddressDividerProps {
    id?: string;
    className?: string;
    required?: boolean;
    readonly?: boolean;
    location?: GeoLocation | string;
    locationPicker?: boolean;
    columns?: AddressDividerColumns;
    country?: string | string[];
    onChange?(sender: AddressDivider, location: GeoLocation): Promise<void>;
}

interface IAddressDividerState {
    location: GeoLocation;
    readonly: boolean;
}

export default class AddressDivider extends BaseComponent<IAddressDividerProps, IAddressDividerState> implements IInput {

    state: IAddressDividerState = {
        location: AddressHelper.toLocation(this.props.location) ?? new GeoLocation(),
        readonly: this.props.readonly ?? false
    };

    private readonly _containerRef: React.RefObject<any> = React.createRef();
    private readonly _addressInputRef: React.RefObject<AddressInput> = React.createRef();

    private get location(): GeoLocation {
        return this.state.location;
    }

    private get addressInput(): AddressInput {
        const container: BaseComponent = this._containerRef.current!;
        return container.findComponent(`${this.id}_formattedAddress`) as AddressInput;
    }

    private async onPlaceSelectedAsync(location: GeoLocation): Promise<void> {
        await this.setState({location});

        if (this.props.onChange) {
            await this.props.onChange(this, location);
        }
    }

    public isInput(): boolean {
        return true
    };

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

    public get columns(): AddressDividerColumns {
        return this.props.columns ?? AddressDividerColumns.Two;
    }

    public async setReadonlyAsync(value: boolean): Promise<void> {
        if (value !== this.state.readonly) {
            await this.setState({readonly: value});
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

        const newReadonly: boolean = (this.props.readonly != nextProps.readonly);
        const newLocation: boolean = (!Comparator.isEqual(this.props.location, nextProps.location));
        const newState: boolean = (newReadonly || newLocation);
        
        await super.componentWillReceiveProps(nextProps);
        
        if (newState) {
            if (newReadonly) {
                this.state.readonly = this.props.readonly ?? false;
            }

            if (newLocation) {
                this.state.location = AddressHelper.toLocation(nextProps.location) ?? new GeoLocation();
            }

            await this.setState(this.state);
        }
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>

                {
                    (this.columns == AddressDividerColumns.Two) &&
                    (
                        <>
                            
                            <TwoColumns ref={this._containerRef} className={this.props.className}>

                                <AddressInput id={`${this.id}_formattedAddress`}
                                              ref={this._addressInputRef}
                                              label={AddressDividerLocalizer.address}
                                              required={this.props.required}
                                              readonly={this.readonly}
                                              value={this.location.formattedAddress}
                                              locationPicker={this.props.locationPicker}
                                              append={this.props.locationPicker}
                                              country={this.props.country}
                                              onChange={async (location) => await this.onPlaceSelectedAsync(location)}
                                />

                                <TextInput id={`${this.id}_address`} label={AddressDividerLocalizer.street} value={this.location.address} readonly/>

                            </TwoColumns>

                            <TwoColumns>
                                <TextInput id={`${this.id}_city`} label={AddressDividerLocalizer.city} value={this.location.city} readonly/>
                                <TextInput id={`${this.id}_postalCode`} label={AddressDividerLocalizer.postalCode} value={this.location.postalCode} readonly/>
                            </TwoColumns>
                            
                        </>
                    )
                }

                {
                    (this.columns == AddressDividerColumns.One) &&
                    (
                        <>
                            
                            <OneColumn ref={this._containerRef} className={this.props.className}>
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
                            </OneColumn>
                            
                            <OneColumn>
                                <TextInput id={`${this.id}_address`} label={AddressDividerLocalizer.street} value={this.location.address} readonly />
                            </OneColumn>

                            <OneColumn>
                                <TextInput id={`${this.id}_city`} label={AddressDividerLocalizer.city} value={this.location.city} readonly />
                            </OneColumn>
                            
                            <OneColumn>
                                <TextInput id={`${this.id}_postalCode`} label={AddressDividerLocalizer.postalCode} value={this.location.postalCode} readonly />
                            </OneColumn>
                            
                        </>
                    )
                }

            </React.Fragment>
        )
    }
}