import React from "react";
import {BaseComponent} from "@weare/athenaeum-react-common";
import {Button, Checkbox, FourColumns, GoogleMap, IGoogleMapMarker, NumberInput, PageRow, ThreeColumns} from "@weare/athenaeum-react-components";

interface IModalTestsState {
    clusterMarkers: boolean;
    lat: number;
    lon: number;
    markerCount: number;
    markersWithInfoWindows: boolean;
    autoCloseInfoWindows: boolean;
}

export default class GoogleMapTests extends BaseComponent<{}, IModalTestsState> {

    public state: IModalTestsState = {
        clusterMarkers: false,
        lat: 0,
        lon: 0,
        markerCount: 0,
        markersWithInfoWindows: false,
        autoCloseInfoWindows: false,
    };

    private readonly _mapRef: React.RefObject<GoogleMap> = React.createRef();

    private get markers(): IGoogleMapMarker[] {

        const markers: IGoogleMapMarker[] = [];

        while (markers.length < this.state.markerCount) {

            const marker: IGoogleMapMarker = {
                title: "marker",
                position: {
                    lat: (Math.random() - 0.5) * 200,
                    lng: (Math.random() - 0.5) * 200
                },
            };

            if (this.state.markersWithInfoWindows) {
                marker.infoWindow = {
                    content: `Info window for marker`,
                    position: marker.position,
                    pixelOffset: {height: -42, width: 0, equals(): boolean {return false}},
                };
            }

            markers.push(marker);
        }

        return markers;
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <PageRow>
                    <ThreeColumns>
                        <NumberInput inline
                                     label="Latitude"
                                     value={this.state.lat}
                                     onChange={async (_, lat) => {await this.setState({lat})}}
                        />

                        <NumberInput inline
                                     label="Longitude"
                                     value={this.state.lon}
                                     onChange={async (_, lon) => {await this.setState({lon})}}
                        />

                        <Button label="Set new center coodinates"
                                onClick={async () => await this._mapRef.current!.setCenterAsync({lat: this.state.lat, lng: this.state.lon})}
                        />
                    </ThreeColumns>
                </PageRow>

                <PageRow>
                    <FourColumns>
                        <NumberInput inline
                                     label="Markers"
                                     value={this.state.markerCount}
                                     onChange={async (_, markerCount) => {await this.setState({markerCount})}}
                        />

                        <Checkbox inline
                                  label="Cluster markers"
                                  value={this.state.clusterMarkers}
                                  onChange={async (_, clusterMarkers) => {await this.setState({clusterMarkers})}}
                        />

                        <Checkbox inline
                                  label="With info windows"
                                  value={this.state.markersWithInfoWindows}
                                  onChange={async (_, markersWithInfoWindows) => {await this.setState({markersWithInfoWindows})}}
                        />

                        <Checkbox inline
                                  label="Auto-close info windows"
                                  value={this.state.autoCloseInfoWindows}
                                  onChange={async (_, autoCloseInfoWindows) => {await this.setState({autoCloseInfoWindows})}}
                        />
                    </FourColumns>
                </PageRow>

                <GoogleMap ref={this._mapRef}
                           height={"50vh"}
                           initialCenter={{lat: 50, lng: 50}}
                           initialZoom={1}
                           markers={this.markers}
                           clusterMarkers={this.state.clusterMarkers}
                           autoCloseInfoWindows={this.state.autoCloseInfoWindows}
                           onClick={async () => {console.log(`map click`)}}
                />
            </React.Fragment>
        );
    }
}