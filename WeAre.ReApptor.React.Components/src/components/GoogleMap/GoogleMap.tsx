import React from "react";
import {BaseComponent} from "@weare/reapptor-react-common";
import {MarkerClusterer} from "@googlemaps/markerclusterer";
import AthenaeumComponentsConstants from "../../AthenaeumComponentsConstants";
import Comparator from "../../helpers/Comparator";
import {GeoCoordinate, GeoLocation} from "@weare/reapptor-toolkit";
import {AddressHelper} from "../../index";

import styles from "./GoogleMap.module.scss";

export type TGoogleMapMarkerCallback = (sender: GoogleMap, marker: IGoogleMapMarker, coordinate: GeoCoordinate) => Promise<void>;

/**
 * A marker displayed in a {@link GoogleMap}.
 */
export interface IGoogleMapMarker extends google.maps.MarkerOptions {

    /**
     * {@link IGoogleMapInfoWindow} associated with the {@link IGoogleMapMarker}.
     */
    infoWindow?: IGoogleMapInfoWindow;
    
    onClick?: TGoogleMapMarkerCallback;
    onDoubleClick?: TGoogleMapMarkerCallback;
}

/**
 * An info window displayed in a {@link GoogleMap}.
 */
export interface IGoogleMapInfoWindow extends google.maps.InfoWindowOptions {
}

export interface IGoogleMapProps {
    id?: string;
    
    /**
     * Classname added to the root element of the {@link GoogleMap}.
     */
    className?: string;

    /**
     * Height of the map. Without a specified height, the map will be rendered with a height of one pixel.
     */
    height: string | number;

    /**
     * Center coordinates of the map.
     */
    center: google.maps.LatLngLiteral | GeoLocation | GeoCoordinate;

    /**
     * Zoom-level of the map. Must be a positive number with a maximum value defined in Google Maps documentation.
     */
    zoom: number;

    /**
     * Should {@link IGoogleMapInfoWindow}'s displayed on the {@link GoogleMap} be automatically closed when a click happens outside of them.
     */
    autoCloseInfoWindows?: boolean;

    /**
     * Should markers be clustered together.
     *
     * @default false
     */
    clusterMarkers?: boolean;

    /** The initial display options for the Street View Pegman control. */
    streetViewControl?: boolean;

    /** The enabled/disabled state of the Fullscreen control. */
    fullscreenControl?: boolean;

    /** The initial enabled/disabled state of the Map type control. */
    mapTypeControl?: boolean;

    /**
     * Markers which are displayed on the map.
     *
     * @default []
     */
    markers?: IGoogleMapMarker[];

    polyLinePath?: google.maps.LatLng[];

    /**
     * Called when the map is clicked.
     * Is not called when an {@link IGoogleMapMarker} or an {@link IGoogleMapInfoWindow} is clicked.
     */
    onClick?(sender: GoogleMap, coordinate: GeoCoordinate): Promise<void>;
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
    private _polyline: google.maps.Polyline | null = null;

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

    private get polylinePath(): google.maps.LatLng[] | null {
        return this.props.polyLinePath || null;
    }
    
    private get center(): google.maps.LatLngLiteral {
        const center: google.maps.LatLngLiteral | GeoLocation | GeoCoordinate = this.props.center;
        if ((center instanceof GeoLocation) || ((center as any).isGeoLocation) ||
            (center instanceof GeoCoordinate) || ((center as any).isGeoCoordinate)) {
            const coordinate: GeoCoordinate | null = AddressHelper.getCoordinate(center as GeoLocation) || AthenaeumComponentsConstants.defaultLocation;
            return {lat: coordinate.lat, lng: coordinate.lon} as google.maps.LatLngLiteral;
        }
        return center;
    }

    // Methods

    private async handlePropsAsync(newEvent: boolean = true, newMarkers: boolean = true, newPolyLine: boolean = true, newZoom: boolean = false, newCenter: boolean = false): Promise<void> {

        if (newMarkers) {
            this._markers.forEach(internalMarker => internalMarker.setMap(null));

            this._markerClusterer.clearMarkers();

            this._infoWindows.forEach(internalInfoWindow => internalInfoWindow.close());

            this._infoWindows = [];

            const markers: IGoogleMapMarker[] = this.props.markers ?? [];

            this._markers = markers.map(newMarker => {
                    const internalMarker: google.maps.Marker = new google.maps.Marker(newMarker);

                    let internalInfoWindow: IGoogleMapInternalInfoWindow | null = null;

                    if (newMarker.infoWindow) {

                        internalInfoWindow = new google.maps.InfoWindow(newMarker.infoWindow);

                        this._infoWindows.push(internalInfoWindow);
                    }
                    
                    internalMarker.addListener("click", (event: google.maps.MapMouseEvent) => {
                        if (internalInfoWindow) {
                            internalInfoWindow.isOpen = !internalInfoWindow.isOpen;
                            if (internalInfoWindow.isOpen) {

                                internalInfoWindow.open(this.googleMap);

                                if (this.autoCloseInfoWindows) {
                                    this.closeInfoWindows(internalInfoWindow);
                                }
                            } else {
                                internalInfoWindow.close();
                            }
                        }

                        if (newMarker.onClick) {
                            const lon: number = event.latLng.lng();
                            const lat: number = event.latLng.lat();
                            const coordinate = new GeoCoordinate(lat, lon);

                            newMarker.onClick(this, newMarker, coordinate);
                        }
                    });

                    internalMarker.addListener("dblclick", (event: google.maps.MapMouseEvent) => {
                        if (newMarker.onDoubleClick) {
                            const lon: number = event.latLng.lng();
                            const lat: number = event.latLng.lat();
                            const coordinate = new GeoCoordinate(lat, lon);

                            newMarker.onDoubleClick(this, newMarker, coordinate);
                        }
                    });

                    return internalMarker;
                }
            );

            if (this.clusterMarkers) {
                this._markerClusterer.setMap(this.googleMap);
                this._markerClusterer.addMarkers(this._markers);
            } else {
                this._markerClusterer.setMap(null);
                this._markers.forEach(internalMarker => internalMarker.setMap(this.googleMap));
            }
        }

        if (newPolyLine) {
            this._polyline?.setMap(null);
            this.setPolyline();
        }

        if (newEvent) {
            this._mapClickEventListener?.remove();
            this._mapClickEventListener = this.googleMap.addListener("click", (event) => this.onMapClickAsync(event));
        }

        if (newZoom) {
            this.googleMap.setZoom(this.props.zoom);
        }

        if (newCenter) {
            this.googleMap.setCenter(this.center);
        }
    }

    private async onMapClickAsync(event: google.maps.MapMouseEvent): Promise<void> {

        if (this.autoCloseInfoWindows) {
            this.closeInfoWindows();
        }
        
        if (this.props.onClick) {

            const lon: number = event.latLng.lng();
            const lat: number = event.latLng.lat();
            const coordinate = new GeoCoordinate(lat, lon);

            await this.props.onClick(this, coordinate);
        }
    }

    /**
     * Close all {@link IGoogleMapInternalInfoWindow}'s, except one if specified.
     *
     * @param except {@link IGoogleMapInternalInfoWindow} to keep open.
     */
    private closeInfoWindows(except?: IGoogleMapInternalInfoWindow): void {
        this._infoWindows.forEach(internalInfoWindow => {
            if (except !== internalInfoWindow) {
                internalInfoWindow.isOpen = false;
                internalInfoWindow.close();
            }
        });
    }

    private setPolyline(): void {
        if ((this._googleMap) && (this.polylinePath)) {
            
            const lineSymbol: google.maps.Symbol = {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1,
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: '#173443',
                strokeColor: '#98c8e5',
                scale: 5
            };

            this._polyline = new google.maps.Polyline({
                path: this.polylinePath,
                map: this._googleMap,
                clickable: false,
                geodesic: true,
                strokeColor: "black",
                strokeOpacity: 0.1,
                strokeWeight: 5,
                icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
            });
            
        }
    }

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        const options: google.maps.MapOptions = {
            streetViewControl: this.props.streetViewControl ?? true,
            fullscreenControl: this.props.fullscreenControl ?? true,
            mapTypeControl: this.props.mapTypeControl ?? true,
            center: this.center,
            zoom: this.props.zoom,
        };

        this._googleMap = await AddressHelper.createMapAsync(this._googleMapDiv.current!, null, null, options)

        await this.handlePropsAsync();
    }

    public async componentWillReceiveProps(nextProps: IGoogleMapProps): Promise<void> {
        const newMarkers: boolean = (!Comparator.isEqual(nextProps.markers, this.props.markers));
        const newCenter: boolean = (!Comparator.isEqual(nextProps.center, this.props.center));
        const newZoom: boolean = (nextProps.zoom != this.props.zoom);
        const newPolyLinePath: boolean = (!Comparator.isEqual(nextProps.polyLinePath, this.props.polyLinePath));
        
        await super.componentWillReceiveProps(nextProps);
        
        await this.handlePropsAsync(false, newMarkers, newPolyLinePath, newZoom, newCenter);
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
            <div id={this.id}
                 ref={this._googleMapDiv}
                 className={this.css(styles.googleMap, this.props.className)}
                 style={{height: this.props.height}}
            />
        );
    }
}