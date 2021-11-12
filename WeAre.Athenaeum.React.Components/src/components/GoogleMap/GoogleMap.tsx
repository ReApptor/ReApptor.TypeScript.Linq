import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {MarkerClusterer} from "@googlemaps/markerclusterer";

import styles from "./GoogleMap.module.scss";


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
     * @default undefined
     */
    className?: string;

    /**
     * Should markers be clustered together.
     * @default false
     */
    clusterMarkers?: boolean;

    /**
     * {@link google.maps.Marker}'s which are displayed on the map.
     * @default []
     */
    markers?: google.maps.Marker[];

    /**
     * {@link google.maps.InfoWindow}'s which are open on the map.
     * @default []
     */
    infoWindows?: google.maps.InfoWindow[];

    /**
     * Called when the map is clicked.
     * Is not called when a {@link google.maps.Marker} or an {@link google.maps.InfoWindow} is clicked.
     * @default undefined
     */
    onClick?(): Promise<void>;
}

interface IGoogleMapState {
    googleMap: google.maps.Map | null;
}

/**
 * A generic Google Maps component.
 */
export default class GoogleMap extends BaseComponent<IGoogleMapProps, IGoogleMapState> {

    // Fields

    private readonly _googleMapDiv: React.RefObject<HTMLDivElement> = React.createRef();
    private readonly _markerClusterer: MarkerClusterer = new MarkerClusterer({});
    private _eventListener: google.maps.MapsEventListener | null = null;
    private _markers: google.maps.Marker[] = [];

    public state: IGoogleMapState = {
        googleMap: null,
    };

    // Properties

    private get clusterMarkers(): boolean {
        return (!!this.props.clusterMarkers);
    }

    private get googleMap(): google.maps.Map {
        return this.state.googleMap!;
    }

    private get infoWindows(): google.maps.InfoWindow[] {
        return this.props.infoWindows ?? [];
    }

    // Methods

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        const googleMap: google.maps.Map = new google.maps.Map(this._googleMapDiv.current!, {
            center: this.props.initialCenter,
            zoom: this.props.initialZoom,
        });

        await this.setState({
            googleMap
        });

        await this.handlePropsAsync();
    }

    public async UNSAFE_componentWillReceiveProps(nextProps: IGoogleMapProps): Promise<void> {
        await super.UNSAFE_componentWillReceiveProps(nextProps);
        await this.handlePropsAsync();
    }

    private async handlePropsAsync(): Promise<void> {
        this._markers.forEach((marker) => {
            marker.setMap(null);
        });
        this._markerClusterer.clearMarkers();

        // need to disassociate the internal markers array from the prop markers array.
        this._markers = [...(this.props.markers ?? [])];

        if (this.clusterMarkers) {
            this._markerClusterer.setMap(this.googleMap);
            this._markerClusterer.addMarkers(this._markers);
        }
        else {
            this._markerClusterer.setMap(null);
            this._markers.forEach(marker => marker.setMap(this.googleMap));
        }

        this.infoWindows.forEach(infoWindow => infoWindow.open(this.googleMap));

        this._eventListener?.remove();
        this._eventListener = this.googleMap.addListener("click", async () => await this.props.onClick?.());
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