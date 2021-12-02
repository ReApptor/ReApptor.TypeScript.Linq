import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

import styles from "./GoogleMap.module.scss";


/**
 * A marker displayed in a {@link GoogleMap}.
 */
export interface IGoogleMapMarker extends google.maps.MarkerOptions {

    /**
     * {@link IGoogleMapInfoWindow} associated with the {@link IGoogleMapMarker}.
     */
    infoWindow?: IGoogleMapInfoWindow;
}

/**
 * An info window displayed in a {@link GoogleMap}.
 */
export interface IGoogleMapInfoWindow extends google.maps.InfoWindowOptions {
}

export interface IGoogleMapProps {

    /**
     * Height of the map. Without a specified height, the map will be rendered with a height of one pixel.
     */
    height: string | number;

    /**
     * Initial center coordinates of the map.
     */
    initialCenter: google.maps.LatLngLiteral;

    /**
     * Initial zoom-level of the map. Must be a positive number with a maximum value defined in Google Maps documentation.
     */
    initialZoom: number;

    /**
     * Should {@link IGoogleMapInfoWindow}'s displayed on the {@link GoogleMap} be automatically closed when a click happens outside of them.
     */
    autoCloseInfoWindows?: boolean;

    /**
     * Classname added to the root element of the {@link GoogleMap}.
     */
    className?: string;

    /**
     * Should markers be clustered together.
     *
     * @default false
     */
    clusterMarkers?: boolean;

    /**
     * Markers which are displayed on the map.
     *
     * @default []
     */
    markers?: IGoogleMapMarker[];

    /**
     * Called when the map is clicked.
     * Is not called when an {@link IGoogleMapMarker} or an {@link IGoogleMapInfoWindow} is clicked.
     */
    onClick?(): Promise<void>;
}

interface IGoogleMapState {
}

/**
 * INTERNAL.
 * {@link google.maps.InfoWindow} with added state to keep track of whether it is open/closed.
 */
interface IGoogleMapInternalInfoWindow extends google.maps.InfoWindow {

    /**
     * Is the {@link google.maps.InfoWindow} currently open.
     *
     * @default false
     */
    isOpen?: boolean;
}

/**
 * A generic Google Maps component.
 */
export default class GoogleMap extends BaseComponent<IGoogleMapProps, IGoogleMapState> {

    // Fields

    private readonly _googleMapDiv: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _markerClusterer: MarkerClusterer = new MarkerClusterer({});
    private _googleMap: google.maps.Map | null = null;
    private _mapClickEventListener: google.maps.MapsEventListener | null = null;
    private _markers: google.maps.Marker[] = [];
    private _infoWindows: IGoogleMapInternalInfoWindow[] = [];

    public state: IGoogleMapState = {
    };

    // Properties

    private get autoCloseInfoWindows(): boolean {
        return (!!this.props.autoCloseInfoWindows);
    }

    private get clusterMarkers(): boolean {
        return (!!this.props.clusterMarkers);
    }

    private get googleMap(): google.maps.Map {
        return this._googleMap!;
    }

    // Methods

    private async handlePropsAsync(): Promise<void> {

        this._markers
            .forEach(
                internalMarker =>
                    internalMarker.setMap(null));

        this._markerClusterer.clearMarkers();

        this._infoWindows
            .forEach(
                internalInfoWindow =>
                    internalInfoWindow.close());

        this._infoWindows = [];

        const newMarkers: IGoogleMapMarker[] = this.props.markers ?? [];

        this._markers = newMarkers
            .map(
                newMarker => {

                    const internalMarker: google.maps.Marker = new google.maps.Marker(newMarker);

                    if (newMarker.infoWindow) {

                        const internalInfoWindow: IGoogleMapInternalInfoWindow = new google.maps.InfoWindow(newMarker.infoWindow);

                        this._infoWindows.push(internalInfoWindow);

                        internalMarker.addListener(
                            "click",
                            () => {

                                internalInfoWindow.isOpen = !internalInfoWindow.isOpen;

                                if (internalInfoWindow.isOpen) {

                                    internalInfoWindow.open(this.googleMap);

                                    if (this.autoCloseInfoWindows) {
                                        this.closeInfoWindows(internalInfoWindow);
                                    }
                                }
                                else {
                                    internalInfoWindow.close();
                                }
                            });
                    }

                    return internalMarker;
                }
        );

        if (this.clusterMarkers) {
            this._markerClusterer.setMap(this.googleMap);
            this._markerClusterer.addMarkers(this._markers);
        }
        else {
            this._markerClusterer.setMap(null);
            this._markers
                .forEach(
                    internalMarker =>
                        internalMarker.setMap(this.googleMap));
        }

        this._mapClickEventListener?.remove();
        this._mapClickEventListener = this.googleMap.addListener(
            "click",
            async () => await this.onMapClickAsync());
    }

    private async onMapClickAsync(): Promise<void> {

        if (this.autoCloseInfoWindows) {
            this.closeInfoWindows();
        }

        await this.props.onClick?.();
    }

    /**
     * Close all {@link IGoogleMapInternalInfoWindow}'s, except one if specified.
     *
     * @param except {@link IGoogleMapInternalInfoWindow} to keep open.
     */
    private closeInfoWindows(except?: IGoogleMapInternalInfoWindow): void {
        this._infoWindows
            .forEach(
                internalInfoWindow => {
                    if (except !== internalInfoWindow ) {
                        internalInfoWindow.isOpen = false;
                        internalInfoWindow.close();
                    }
                });
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        this._googleMap = new google.maps.Map(this._googleMapDiv.current!, {
            center: this.props.initialCenter,
            zoom: this.props.initialZoom,
        });

        await this.handlePropsAsync();
    }

    public async UNSAFE_componentWillReceiveProps(nextProps: IGoogleMapProps): Promise<void> {
        await super.componentWillReceiveProps(nextProps);
        await this.handlePropsAsync();
    }

    /**
     * Center the map on the given coordinates.
     * @param center New center coordinates of the map.
     */
    public async setCenterAsync(center: google.maps.LatLngLiteral): Promise<void> {
        this.googleMap.setCenter(center);
    }

    public render() {
        return (
            <div ref={this._googleMapDiv}
                 className={this.css(styles.googleMap, this.props.className)}
                 style={{height: this.props.height}}
            />
        );
    }
}