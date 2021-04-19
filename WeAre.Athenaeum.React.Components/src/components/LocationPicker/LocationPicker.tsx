import React from "react";
import {GeoLocation, GeoCoordinate} from "@weare/athenaeum-toolkit";
import {BaseComponent, IBaseComponent} from "@weare/athenaeum-react-common";
import Comparator from "../../helpers/Comparator";
import AddressHelper from "../../helpers/AddressHelper";
import AddressInput from "../AddressInput/AddressInput";

import styles from "./LocationPicker.module.scss";

interface ILocationPickerProps {
    id?: string;
    className?: string;
    location?: GeoLocation;
    infoWindow?: boolean;
    readonly?: boolean;
    fullWidth?: boolean;
    onChange?(sender: IBaseComponent, location: GeoLocation): Promise<void>
}

interface ILocationPickerState {
    location: GeoLocation | null;
    searchLocation: string;
}

export default class LocationPicker extends BaseComponent<ILocationPickerProps, ILocationPickerState> {

    state: ILocationPickerState = {
        location: this.props.location || null,
        searchLocation: this.props.location != null ? this.props.location.formattedAddress : ""
    };

    private readonly _addressInputRef: React.RefObject<AddressInput> = React.createRef();
    private readonly _locationPickerRef: React.RefObject<HTMLDivElement> = React.createRef();

    private _googleMap: google.maps.Map | null = null;
    private _marker: google.maps.Marker | null = null;
    private _infoWindow: google.maps.InfoWindow | null = null;

    private get locationPicker(): HTMLDivElement {
        return this._locationPickerRef.current!;
    }

    private get addressInput(): AddressInput {
        return this._addressInputRef.current!;
    }

    private get googleMap(): google.maps.Map {
        return this._googleMap!;
    }

    private get isValidLocation(): boolean {
        return (this.location != null) && AddressHelper.hasCoordinates(this.location);
    }

    private get infoWindowContent(): string {
        return (this.location)
            ? `<div class="infoContent">
                    <span class="address">${AddressHelper.removeLatLon(this.location.formattedAddress)}</span>
                    <span class="dms">${AddressHelper.toDMS(this.location)}</span>
               </div>
               `
            : "";
    }

    private async initAsync(): Promise<void> {
        this._googleMap = await AddressHelper.createMapAsync(this.locationPicker, this.state.location);

        if (!this.readonly) {
            AddressHelper.google.maps.event.addListener(this._googleMap, "click", async (event: any) => {
                await this.onMapClickAsync(event.latLng);
            });
        }

        if (this.location) {
            await this.coordinateLocationAsync(this.location);

            await this.setMarkerAsync(true);
        }
    }

    private async coordinateLocationAsync(location: GeoLocation): Promise<void> {
        if (!AddressHelper.hasCoordinates(location)) {
            const coordinate: GeoCoordinate | null = await AddressHelper.findAddressAsync(this.googleMap, location.formattedAddress);

            if (coordinate != null) {
                location.lat = coordinate.lat;
                location.lon = coordinate.lon;

                await this.invokeOnChangeAsync();
            }
        }
    }

    private async invokeOnChangeAsync(): Promise<void> {
        if (this.props.onChange && this.location) {
            await this.props.onChange(this, this.location);
        }
    }

    private async setLocationAsync(location: GeoLocation, setCenter: boolean = false): Promise<void> {
        await this.setState({location});

        await this.setMarkerAsync(setCenter);
    }

    private async onMapClickAsync(latLng: google.maps.LatLng): Promise<void> {
        if (!this.readonly) {
            const location: GeoLocation | null = await AddressHelper.findLocationByLatLngAsync(latLng);

            if (location) {
                location.lat = latLng.lat();
                location.lon = latLng.lng();

                this.state.searchLocation = "";

                await this.setLocationAsync(location);

                await this.invokeOnChangeAsync();
            }
        }
    }

    private async setMarkerAsync(setCenter: boolean = false): Promise<void> {
        if (this.location && this.isValidLocation) {
            const latLng = new AddressHelper.google.maps.LatLng(this.location.lat, this.location.lon);

            if (this._marker) {
                this._marker.setPosition(latLng);
            } else {
                this._marker = await AddressHelper.addMarkerAsync(latLng, this.googleMap);
            }

            if (this.props.infoWindow) {
                if (this._infoWindow) {
                    this._infoWindow.close();

                    this._infoWindow.setContent(this.infoWindowContent);
                } else {
                    this._infoWindow = await AddressHelper.addInfoWindow(this.infoWindowContent);
                }

                this._marker.addListener("click", () => this._infoWindow!.open(this._googleMap!, this._marker!));
            }

            if (setCenter) {
                this.googleMap.setCenter(latLng);
            }
        }
    }

    private async onInputChange(location: GeoLocation): Promise<void> {
        this.state.searchLocation = location.formattedAddress;

        await this.setLocationAsync(location, true);

        await this.invokeOnChangeAsync();
    }

    public async componentWillReceiveProps(nextProps: ILocationPickerProps): Promise<void> {
        const nextLocation: GeoLocation | null = nextProps.location || null;

        const newLocation: boolean = (!Comparator.isEqual(this.state.location, nextLocation));

        if (newLocation && nextLocation) {
            this.state.searchLocation = nextLocation.formattedAddress;

            await this.setLocationAsync(nextLocation, true);

            await this.coordinateLocationAsync(nextLocation);
        }
    }

    public async componentDidMount(): Promise<void> {
        await this.initAsync();
    }

    public focus(): void {
        this.addressInput.focus();
    }

    public get readonly(): boolean {
        return (this.props.readonly == true);
    }

    public get location(): GeoLocation | null {
        return this.state.location;
    }

    public get formattedAddress(): string {
        return this.location
            ? this.location.formattedAddress
            : "";
    }

    public render(): React.ReactElement {
        return (
            <div className={this.css(styles.locationPicker, this.props.fullWidth && styles.fullWidth)}>

                {
                    (!this.readonly) &&
                    (
                        <AddressInput id={`AddressInput_within_location_${this.id}`}
                                      readonly={this.readonly}
                                      ref={this._addressInputRef}
                                      value={this.state.searchLocation}
                                      onChange={(location: GeoLocation) => this.onInputChange(location)}
                        />
                    )
                }

                <div id={this.props.id || this.id}
                     ref={this._locationPickerRef}
                     className={styles.map}
                />

            </div>
        )
    }
}
