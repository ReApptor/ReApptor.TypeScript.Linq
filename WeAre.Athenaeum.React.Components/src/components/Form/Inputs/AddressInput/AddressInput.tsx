import React from "react";
import $ from "jquery";
import Autocomplete from "react-google-autocomplete";
import {GeoLocation, Utility} from "@weare/athenaeum-toolkit";
import {ch} from "@weare/athenaeum-react-common";
import {BaseInputType} from "@/models/Enums";
import BaseInput, {IBaseInputProps, IBaseInputState} from "../BaseInput";
import Icon, {IconSize} from "@/components/Icon/Icon";
import LocationPickerModal from "@/components/Form/Inputs/AddressInput/LocationPickerModal/LocationPickerModal";
import AddressHelper, {GoogleApiResult} from "@/helpers/AddressHelper";
import Comparator from "@/helpers/Comparator";

import textInputStyles from "../TextInput/TextInput.module.scss";
import styles from "@/components/Form/Form.module.scss";

export interface IAddressInputProps extends IBaseInputProps<string> {
    small?: boolean;
    readonly?: boolean;
    locationPicker?: boolean;

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

    private async openLocationPickerAsync(): Promise<void> {
        if (this.locationPickerModal) {
            await this.locationPickerModal.openAsync();
        }
    }

    private async onInputKeyDownHandlerAsync(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    }

    private async invokeOnChangeAsync(): Promise<void> {
        if (this.props.onChange && this.state.location) {
            await this.props.onChange(this.state.location);
        }
    }

    private async onPlaceSelectedAsync(place: GoogleApiResult): Promise<void> {
        if (place.formatted_address != AddressHelper.removeLatLon(this.value)) {

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

    public async onGlobalClick(e: React.SyntheticEvent<Element, Event>): Promise<void> {
        if (this.props.clickToEdit) {
            const targetNode = e.target as Node;
            let outside: boolean = Utility.clickedOutside(targetNode, this.id);

            if (this.props.locationPicker) {
                outside = Utility.clickedOutside(targetNode, this.id) && Utility.clickedOutside(targetNode, `locationPicker_${this.id}`);
            }
            
            outside = outside && (!$(targetNode).parents(".pac-container").length);

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

    private renderLocationPicker(): React.ReactNode | null {
        if ((this.props.locationPicker)) {
            return (
                <LocationPickerModal ref={this._locationPickerModalRef} infoWindow
                                     id={`locationPicker_${this.id}`}
                                     location={this.state.location || undefined}
                                     readonly={this.readonly}
                                     onSubmit={async (sender, location) => await this.onLocationSetAsync(location)}/>
            )
        }

        return null;
    }

    public renderAppend(): React.ReactNode {
        if (this.props.locationPicker && this.state.edit) {
            return (
                <div className={"input-group-append cursor-pointer"} onClick={() => this.openLocationPickerAsync()}>
                    <span  className={this.css("input-group-text", styles.append, this.state.validationError && styles.validationError)}>
                        <Icon name={"fas map-marker-alt"}/>
                    </span>
                </div>
            )
        }
        if (this.state.edit) {
            return super.renderAppend();
        }

    }

    public renderInput(): React.ReactNode {
        const smallStyle: any = (this.props.small) && textInputStyles.small;

        return (
            <React.Fragment>
                <Autocomplete
                    key={`${this.getInputId()}_${this.state.generation}`}
                    onKeyDown={async (e: React.KeyboardEvent<HTMLInputElement>) => await this.onInputKeyDownHandlerAsync(e)}
                    className={this.css(textInputStyles.textInput, "form-control", smallStyle)}
                    onPlaceSelected={async (place: GoogleApiResult) => await this.onPlaceSelectedAsync(place)}
                    types={["address"]}
                    fields={["address_components", "formatted_address", "geometry"]}
                    componentRestrictions={{country: ch.country}}
                    defaultValue={this.defaultValue || undefined}
                    readOnly={this.readonly}
                />

                {this.renderLocationPicker()}
            </React.Fragment>
        )
    }
}