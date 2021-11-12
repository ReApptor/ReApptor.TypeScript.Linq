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
    eventListener: google.maps.MapsEventListener | null;
    googleMap: google.maps.Map | null;

}

export default class GoogleMap extends BaseComponent<IGoogleMapProps, IGoogleMapState> {

    private markerClusterer: MarkerClusterer = new MarkerClusterer({});

    public state: IGoogleMapState = {
        eventListener: null,
        googleMap: null
    };

    public async initializeAsync(): Promise<void> {
        await super.initializeAsync();

        const googleMap: google.maps.Map = new google.maps.Map(this.googleMapDiv, {
            center: this.props.initialCenter,
            zoom: this.props.initialZoom,
        });

        await this.setState({
            googleMap
        });

        if (this.props.clusterMarkers) {
            this.markerClusterer.setMap(this.googleMap);
        }
        await this.handlePropsAsync();
    }

    public async componentWillReceiveProps(nextProps: IGoogleMapProps): Promise<void> {
        await super.componentWillReceiveProps(nextProps);

        await this.handlePropsAsync();
    }

    // Fields

    private readonly _googleMapDiv: React.RefObject<HTMLDivElement> = React.createRef();

    // Getters

    private get eventListener(): google.maps.MapsEventListener | null {
        return this.state.eventListener;
    }

    private get markers(): google.maps.Marker[] {
        return this.props.markers ?? [];
    }

    private get infoWindows(): google.maps.InfoWindow[] {
        return this.props.infoWindows ?? [];
    }

    private get googleMapDiv(): HTMLDivElement {
        return this._googleMapDiv.current!;
    }

    private get googleMap(): google.maps.Map {
        return this.state.googleMap!;
    }

    // Async-methods
    private async handlePropsAsync(): Promise<void> {
        if (this.props.clusterMarkers) {
            this.markerClusterer.clearMarkers();
            this.markerClusterer.addMarkers(this.markers);
        }
        else {
            this.markers.forEach(marker => marker.setMap(this.googleMap));
        }
        this.infoWindows.forEach(infoWindow => infoWindow.open(this.googleMap));
        await this.setEventListenerAsync(this.googleMap.addListener("click", async () => await this.props.onClick?.()));
    }

    private async setEventListenerAsync(newEventListener: google.maps.MapsEventListener | null): Promise<void> {
        this.eventListener?.remove();
        await this.setState({
            eventListener: newEventListener,
        });
    }

    // Renders

    public render() {
        return (
            <div ref={this._googleMapDiv}
                 className={this.css(styles.googleMap, this.props.className)}
                 style={{height: this.props.height}}
            />
        );
    }
}