import React from "react";
import Autocomplete from "react-google-autocomplete";
import {GeoLocation, Utility} from "@weare/reapptor-toolkit";
import {ch, BaseInputType} from "@weare/reapptor-react-common";
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput/BaseInput";
import LocationPickerModal from "../LocationPickerModal/LocationPickerModal";
import AddressHelper, { GoogleApiResult } from "../../helpers/AddressHelper";
import Comparator from "../../helpers/Comparator";
import Icon from "../Icon/Icon";
import AddressInputLocalizer from "./AddressInputLocalizer";

import formStyles from "../Form/Form.module.scss";
import textInputStyles from "../TextInput/TextInput.module.scss";


export interface IAddressInputProps extends IBaseInputProps<string> {
    small?: boolean;
    readonly?: boolean;

    /**
     * Should an icon which clicking opens a Map where the user can select their location be displayed.
     */
    locationPicker?: boolean;

    country?: string | string[];

    onChange?(location: GeoLocation): Promise<void>;
}

export interface IAddressInputState extends IBaseInputState<string> {
    generation: number;
    location: GeoLocation | null;
    inputValue: boolean;
}

export default class AddressInput extends BaseInput<string, IAddressInputProps, IAddressInputState> {

    state: IAddressInputState = {
        model: {
            value: this.props.value || ""
        },
        edit: !this.props.clickToEdit,
        readonly: this.props.readonly || false,
        validationError: "",
        generation: 0,
        location: AddressHelper.toLocation(this.props.value),
        inputValue: false
    };

    private readonly _locationPickerModalRef: React.RefObject<LocationPickerModal> = React.createRef();

    private get locationPickerModal(): LocationPickerModal | null {
        return this._locationPickerModalRef.current;
    }

    private get locationPickerIsOpen(): boolean {
        return !!this.locationPickerModal && this.locationPickerModal.isOpen;
    }

    private async openLocationPickerAsync(): Promise<void> {
        if (this.locationPickerModal) {
            await this.locationPickerModal.openAsync();
            await this.reRenderAsync();
        }
    }

    private async onInputKeyDownHandlerAsync(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.keyCode === 13) {
            e.preventDefault();
        } else if (e.keyCode === 27) {
            await this.setEditAsync(false);
        }
    }

    private async invokeOnChangeAsync(): Promise<void> {

        if (this.state.location) {
            await this.setEditAsync(false);

            if (this.props.onChange) {
                await this.props.onChange(this.state.location);
            }
        }
    }

    private async onPlaceSelectedAsync(place: GoogleApiResult): Promise<void> {
        if (place.formatted_address !== AddressHelper.removeLatLon(this.value)) {

            const geoLocation: GeoLocation = AddressHelper.getLocationFromGeocodeResult(place);

            this.state.location = geoLocation;
            this.state.inputValue = true;

            await this.updateValueAsync(geoLocation.formattedAddress);

            await this.invokeOnChangeAsync();

            if (this.props.clickToEdit) {
                await this.setState({edit: false});
            }
        }
    }

    private async onLocationCloseAsync(): Promise<void> {
        await this.reRenderAsync();
    }

    private async onLocationSetAsync(location: GeoLocation): Promise<void> {
        const isEqual: boolean = Comparator.isEqual(this.state.location, location);

        if (!isEqual) {
            this.state.location = location;
            this.state.inputValue = false;

            this.onValuePropsChanged();

            await this.updateValueAsync(location.formattedAddress);

            await this.invokeOnChangeAsync();
        }
    }

    private get locationPickerId(): string {
        return `locationPicker_${this.id}`;
    }

    private get defaultValue(): string | null {
        return this.state.inputValue
            ? null
            : this.getFormattedStr();
    }

    protected getType(): BaseInputType {
        return BaseInputType.Text;
    }

    protected onValuePropsChanged(): void {
        const state: IAddressInputState = this.state;
        state.generation = state.generation + 1;
    }

    protected getFormattedStr(): string {
        return AddressHelper.removeLatLon(this.value);
    }

    public getCustomRequiredValidationError(): string {
        return AddressInputLocalizer.validatorsCustomRequired;
    }

    public async onGlobalClick(e: React.SyntheticEvent<Element, Event>): Promise<void> {
        if (this.props.clickToEdit) {

            const targetNode = e.target as Node;
            let outside: boolean = Utility.clickedOutside(targetNode, this.id);

            if (this.props.locationPicker) {
                outside = outside && Utility.clickedOutside(targetNode, this.locationPickerId);
            }

            outside = outside && (!this.JQuery(targetNode).parents(".pac-container").length);

            if (outside) {
                await this.hideEditAsync();
            }
        }
    }

    public async componentWillReceiveProps(nextProps: IAddressInputProps): Promise<void> {
        const nextLocation: GeoLocation | null = AddressHelper.toLocation(nextProps.value);

        const newLocation: boolean = (!Comparator.isEqual(this.state.location, nextLocation));

        if (newLocation) {
            this.state.inputValue = false;

            this.onValuePropsChanged();

            await this.setState({location: nextLocation});
        }

        await super.componentWillReceiveProps(nextProps);
    }

    public get countries(): string[] | null {
        return (this.props.country != null)
            ? (typeof this.props.country === "string")
                ? (this.props.country)
                    ? [this.props.country]
                    : null
                : (this.props.country.length > 0)
                    ? this.props.country
                    : null
            : [ch.country];
    }

    private renderLocationPicker(): React.ReactNode | null {
        if (this.props.locationPicker) {
            return (
                <LocationPickerModal ref={this._locationPickerModalRef} infoWindow
                                     id={this.locationPickerId}
                                     location={this.state.location || undefined}
                                     required={this.props.required}
                                     readonly={this.readonly}
                                     onClose={() => this.onLocationCloseAsync()}
                                     onSubmit={(sender, location) => this.onLocationSetAsync(location)}
                />
            )
        }

        return null;
    }

    public renderAppend(): React.ReactNode | undefined {

        if (this.props.locationPicker && this.state.edit) {
            return (
                <div className={"input-group-append cursor-pointer"} onClick={() => this.openLocationPickerAsync()}>
                    <span  className={this.css("input-group-text", formStyles.append, this.state.validationError && formStyles.validationError)}>
                        <Icon name={"fas map-marker-alt"}/>
                    </span>
                </div>
            )
        }

        if (this.state.edit) {
            return super.renderAppend();
        }

        return;
    }

    public renderInput(): React.ReactNode {
        const smallStyle: any = (this.props.small) && textInputStyles.small;
        return (
            <React.Fragment>

                {
                    <Autocomplete key={`${this.getInputId()}_${this.state.generation}`}
                                  className={this.css(textInputStyles.textInput, "form-control", smallStyle)}
                                  onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyDownHandlerAsync(e)}
                                  onPlaceSelected={async (place: GoogleApiResult) => await this.onPlaceSelectedAsync(place)}
                                  types={["address"]}
                                  fields={["address_components", "formatted_address", "geometry"]}
                                  componentRestrictions={{country: this.countries}}
                                  defaultValue={this.defaultValue || undefined}
                                  disabled={this.locationPickerIsOpen}
                                  readOnly={this.readonly}
                    />
                }

                {this.renderLocationPicker()}

            </React.Fragment>
        )
    }
}